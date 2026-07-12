# Fix encoding issue in ai_service.py
import pathlib
p = pathlib.Path(r"E:\ai\backend\app\services\ai_service.py")
content = p.read_text(encoding="utf-8")
# The problem is nested double quotes inside f-string
old = 'return f"你好！我是「{PERSONAS.get(persona, PERSONAS[\'assistant\'])[\'name\']}」。当前使用 **Mock 模式**，请在右上角"设置"中配置真实大模型 API Key。"'
new = 'return f"你好！我是「{PERSONAS.get(persona, PERSONAS[\'assistant\'])[\'name\']}」。当前使用 **Mock 模式**，请点击右上角设置按钮配置真实大模型 API Key。"'
if old in content:
    content = content.replace(old, new)
    p.write_text(content, encoding="utf-8")
    print("Fixed!")
else:
    # Try to find the line
    for i, line in enumerate(content.split("\n"), 1):
        if "Mock 模式" in line and "设置" in line:
            print(f"Line {i}: {line}")
    print("Exact match not found, showing context")
