"""简单的 API 测试脚本"""
import requests
import sys
import os

# 强制 UTF-8 输出
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE = "http://127.0.0.1:5000/api"

PASS = "[OK]"
FAIL = "[FAIL]"


def test_health():
    """测试健康检查"""
    print("\n[1] 测试 /api/health")
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    assert data["data"]["status"] == "ok"
    print(f"  ✓ OK - {data['data']}")


def test_personas():
    """测试获取角色列表"""
    print("\n[2] 测试 /api/personas")
    r = requests.get(f"{BASE}/personas")
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    personas = data["data"]
    assert len(personas) >= 3
    print(f"  ✓ OK - 找到 {len(personas)} 个角色:")
    for p in personas:
        print(f"     - {p['key']}: {p['name']}")


def test_create_and_chat():
    """测试创建对话并发送消息"""
    print("\n[3] 测试创建对话 + 发送消息")
    r = requests.post(f"{BASE}/chat", json={
        "message": "你好",
        "persona": "assistant"
    })
    assert r.status_code == 200, f"状态码: {r.status_code}"
    data = r.json()
    assert data["code"] == 0
    assert "user_message" in data["data"]
    assert "assistant_message" in data["data"]
    print(f"  ✓ 创建对话成功: {data['data']['conversation']['id']}")
    print(f"  ✓ AI 回复: {data['data']['assistant_message']['content'][:80]}...")
    return data["data"]["conversation"]["id"]


def test_chat_continue(conv_id):
    """在已有对话中继续聊天"""
    print(f"\n[4] 测试在对话 {conv_id[:8]}... 中继续聊天")
    r = requests.post(f"{BASE}/chat", json={
        "conversation_id": conv_id,
        "message": "继续说",
        "persona": "assistant"
    })
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    assert data["data"]["conversation"]["id"] == conv_id
    print(f"  ✓ OK - 当前共 {data['data']['conversation']['message_count']} 条消息")


def test_list_conversations():
    """测试获取对话列表"""
    print("\n[5] 测试 /api/conversations")
    r = requests.get(f"{BASE}/conversations")
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    print(f"  ✓ OK - 共有 {len(data['data'])} 个对话")


def test_get_conversation(conv_id):
    """测试获取对话详情"""
    print(f"\n[6] 测试获取对话详情 {conv_id[:8]}...")
    r = requests.get(f"{BASE}/conversations/{conv_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    msgs = data["data"]["messages"]
    print(f"  ✓ OK - 对话有 {len(msgs)} 条消息")


def test_update_conversation(conv_id):
    """测试更新对话"""
    print(f"\n[7] 测试更新对话 {conv_id[:8]}...")
    r = requests.patch(
        f"{BASE}/conversations/{conv_id}",
        json={"title": "测试对话（已重命名）", "persona": "programmer"}
    )
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    assert data["data"]["title"] == "测试对话（已重命名）"
    print(f"  ✓ OK - 标题已更新: {data['data']['title']}")


def test_delete_conversation(conv_id):
    """测试删除对话"""
    print(f"\n[8] 测试删除对话 {conv_id[:8]}...")
    r = requests.delete(f"{BASE}/conversations/{conv_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["code"] == 0
    print(f"  ✓ OK - 对话已删除")


def test_error_handling():
    """测试错误处理"""
    print("\n[9] 测试错误处理")

    # 空消息
    r = requests.post(f"{BASE}/chat", json={"message": ""})
    assert r.status_code == 400
    print(f"  ✓ 空消息返回 400")

    # 不存在的对话
    r = requests.post(f"{BASE}/chat", json={
        "message": "test",
        "conversation_id": "non-existent-uuid"
    })
    assert r.status_code == 404
    print(f"  ✓ 不存在的对话返回 404")

    # 不存在的对话详情
    r = requests.get(f"{BASE}/conversations/non-existent")
    assert r.status_code == 404
    print(f"  ✓ 不存在的对话详情返回 404")


def main():
    print("=" * 50)
    print("AI Chat Backend API 测试")
    print("=" * 50)

    try:
        test_health()
        test_personas()
        conv_id = test_create_and_chat()
        test_chat_continue(conv_id)
        test_list_conversations()
        test_get_conversation(conv_id)
        test_update_conversation(conv_id)
        test_delete_conversation(conv_id)
        test_error_handling()

        print("\n" + "=" * 50)
        print("✅ 所有测试通过！")
        print("=" * 50)
        return 0
    except AssertionError as e:
        print(f"\n❌ 测试失败: {e}")
        return 1
    except requests.ConnectionError:
        print("\n❌ 无法连接到后端，请先启动服务 (python run.py)")
        return 1


if __name__ == "__main__":
    sys.exit(main())
