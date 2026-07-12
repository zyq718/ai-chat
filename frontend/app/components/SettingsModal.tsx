"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  message,
  Space,
  Tag,
  Typography,
  Alert,
  Tabs,
  Card,
  Divider,
  Spin,
  Tooltip,
} from "antd";
import {
  SettingOutlined,
  KeyOutlined,
  LinkOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApiOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Provider {
  key: string;
  name: string;
  base_url: string;
  default_model: string;
  models: string[];
  docs_url: string;
  note: string;
}

interface ProvidersResponse {
  providers: Provider[];
  personas: { key: string; name: string }[];
  current: { provider: string; model: string; has_api_key: boolean };
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [data, setData] = useState<ProvidersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    model?: string;
    elapsed?: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const API_BASE =
    typeof window !== "undefined" && window.location.port === "3000"
      ? "" // 通过 Next.js 代理
      : "http://127.0.0.1:5000";

  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/providers`);
      const json = await res.json();
      if (json.code === 0) {
        setData(json.data);
        form.setFieldsValue({
          provider: json.data.current.provider,
          model: json.data.current.model,
          base_url:
            json.data.providers.find(
              (p: Provider) => p.key === json.data.current.provider
            )?.base_url || "",
        });
      }
    } catch (e) {
      message.error("加载 Provider 列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (key: string) => {
    const p = data?.providers.find((x) => x.key === key);
    if (p) {
      form.setFieldsValue({
        base_url: p.base_url,
        model: p.default_model,
      });
    }
  };

  const handleTest = async () => {
    const v = await form.validateFields(["provider", "api_key", "base_url", "model"]);
    if (v.provider !== "mock" && !v.api_key) {
      message.warning("非 Mock Provider 必须填写 API Key");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/test-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const json = await res.json();
      if (json.code === 0 && !json.data?.error) {
        setTestResult({
          ok: true,
          message: json.data?.content || "连接成功",
          model: json.data?.model,
          elapsed: json.data?.elapsed_s,
        });
        message.success("AI 测试成功！");
      } else {
        setTestResult({
          ok: false,
          message: json.data?.content || "测试失败",
        });
        message.error("AI 测试失败");
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || "网络错误" });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    const v = await form.validateFields();
    setSaving(true);
    try {
      // 保存到 localStorage（前端动态覆盖使用）
      localStorage.setItem("ai_settings", JSON.stringify(v));
      message.success(
        "设置已保存到本地存储。立即生效（前端调用时会带上这些参数）。"
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToEnv = async () => {
    const v = await form.validateFields();
    setSaving(true);
    try {
      const envContent = generateEnvFile(v);
      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(envContent);
        message.success("已复制 .env 内容到剪贴板，粘贴到 backend/.env 后重启服务");
      } catch {
        Modal.info({
          title: "生成的 .env 文件内容",
          width: 600,
          content: (
            <TextArea
              value={envContent}
              autoSize={{ minRows: 8, maxRows: 16 }}
              readOnly
            />
          ),
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Hooks 必须在最顶层调用，保证调用顺序一致
  const currentProvider = Form.useWatch("provider", form);

  if (!data) {
    return (
      <Modal title="AI 设置" open={open} onCancel={onClose} footer={null}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      </Modal>
    );
  }

  const selectedProvider = data.providers.find((p) => p.key === currentProvider);

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>AI 大模型设置</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={680}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Alert
          message="选择真实大模型后，AI 才能真正理解你的问题并智能回答"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={form} layout="vertical" size="middle">
          <Form.Item
            label={
              <Space>
                <RobotOutlined />
                <span>选择 Provider</span>
              </Space>
            }
            name="provider"
            rules={[{ required: true, message: "请选择 Provider" }]}
          >
            <Select onChange={handleProviderChange}>
              {data.providers.map((p) => (
                <Select.Option key={p.key} value={p.key}>
                  <Space>
                    <Tag color={p.key === "mock" ? "default" : "blue"}>
                      {p.key}
                    </Tag>
                    <span>{p.name}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedProvider && (
            <Alert
              message={
                <Space direction="vertical" size={2} style={{ width: "100%" }}>
                  <Text>{selectedProvider.note}</Text>
                  {selectedProvider.docs_url && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <LinkOutlined /> 申请 API Key：{" "}
                      <a
                        href={selectedProvider.docs_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {selectedProvider.docs_url}
                      </a>
                    </Text>
                  )}
                </Space>
              }
              type="info"
              showIcon={false}
              style={{ marginBottom: 16, background: "#f0f5ff", border: "1px solid #d6e4ff" }}
            />
          )}

          <Form.Item
            label={
              <Space>
                <KeyOutlined />
                <span>API Key</span>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  (仅保存在本地，不会上传)
                </Text>
              </Space>
            }
            name="api_key"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("provider") === "mock") {
                    return Promise.resolve();
                  }
                  if (!value) {
                    return Promise.reject(new Error("非 Mock Provider 必须填 API Key"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={
                currentProvider === "mock"
                  ? "Mock 模式无需 API Key"
                  : "sk-xxxxxxxxxxxxxxxxxxxx"
              }
              disabled={currentProvider === "mock"}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <ApiOutlined />
                <span>Base URL</span>
              </Space>
            }
            name="base_url"
            tooltip="一般无需修改，使用 Provider 默认地址"
          >
            <Input placeholder="https://api.deepseek.com" />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <ThunderboltOutlined />
                <span>模型名称</span>
              </Space>
            }
            name="model"
          >
            <Select
              mode="tags"
              maxCount={1}
              placeholder="选择或输入模型"
              options={selectedProvider?.models.map((m) => ({ value: m, label: m }))}
            />
          </Form.Item>

          {testResult && (
            <Alert
              message={
                <Space>
                  {testResult.ok ? (
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                  )}
                  <Text strong>
                    {testResult.ok ? "测试成功" : "测试失败"}
                  </Text>
                  {testResult.model && <Tag>{testResult.model}</Tag>}
                  {testResult.elapsed && (
                    <Text type="secondary">{testResult.elapsed}s</Text>
                  )}
                </Space>
              }
              description={
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: "#fafafa",
                    borderRadius: 6,
                    maxHeight: 200,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    fontSize: 13,
                  }}
                >
                  {testResult.message}
                </div>
              }
              type={testResult.ok ? "success" : "error"}
              showIcon={false}
              style={{ marginBottom: 16 }}
            />
          )}

          <Divider style={{ margin: "12px 0" }} />

          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Space>
              <Button
                icon={<ThunderboltOutlined />}
                onClick={handleTest}
                loading={testing}
              >
                测试连接
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={handleSaveToEnv}
                loading={saving}
              >
                生成 .env 文件
              </Button>
            </Space>
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button type="primary" onClick={handleSave} loading={saving}>
                保存（仅本次会话）
              </Button>
            </Space>
          </Space>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 提示：
              <ul style={{ paddingLeft: 20, margin: "4px 0" }}>
                <li>「保存（仅本次会话）」：设置仅保存在浏览器 localStorage，刷新后需重新设置</li>
                <li>「生成 .env 文件」：复制配置到 backend/.env，需重启后端才永久生效</li>
                <li>推荐使用 DeepSeek（性价比高）或 通义千问，国产访问稳定</li>
              </ul>
            </Text>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

function generateEnvFile(v: any): string {
  if (v.provider === "mock") {
    return `AI_PROVIDER=mock
`;
  }
  return `AI_PROVIDER=${v.provider}
AI_API_KEY=${v.api_key || ""}
AI_BASE_URL=${v.base_url || ""}
AI_MODEL=${v.model || ""}
`;
}
