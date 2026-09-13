import os
import sys
import time
import json
from openai import OpenAI
from chat_test import AVAILABLE_MODELS, get_api_key

def main():
    api_key = get_api_key()
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
        timeout=10.0
    )

    print(f"Testing {len(AVAILABLE_MODELS)} models against NVIDIA NIM Chat Completions API...\n")

    working_models = []
    failed_models = []

    for i, model in enumerate(AVAILABLE_MODELS, 1):
        model_id = model["id"]
        print(f"[{i:2d}/{len(AVAILABLE_MODELS)}] Testing: {model['name']} ({model_id})...", end="", flush=True)

        start = time.perf_counter()
        success = False
        err_reason = ""
        response_sample = ""

        # Try first without thinking, and then with thinking if specified
        for enable_thinking in ([True, False] if model.get("supports_thinking") else [False]):
            try:
                kwargs = {
                    "model": model_id,
                    "messages": [{"role": "user", "content": "Say hello in 3 words"}],
                    "max_tokens": 64,
                    "temperature": 0.1,
                    "stream": False,
                    "timeout": 10.0
                }
                if enable_thinking:
                    kwargs["extra_body"] = {"chat_template_kwargs": {"enable_thinking": True}}

                res = client.chat.completions.create(**kwargs)
                if res and res.choices and len(res.choices) > 0:
                    content = res.choices[0].message.content or ""
                    reasoning = getattr(res.choices[0].message, "reasoning_content", None)
                    if content or reasoning:
                        response_sample = (content or reasoning).strip()[:30]
                        success = True
                        model["supports_thinking"] = enable_thinking
                        break
            except Exception as e:
                err_reason = str(e)

        elapsed = time.perf_counter() - start

        if success:
            print(f" \033[32mPASSED ({elapsed:.2f}s)\033[0m -> '{response_sample}'")
            working_models.append(model)
        else:
            # Shorten error message
            short_err = err_reason.splitlines()[0] if err_reason else "Unknown error"
            if len(short_err) > 60:
                short_err = short_err[:60] + "..."
            print(f" \033[31mFAILED ({elapsed:.2f}s)\033[0m: {short_err}")
            failed_models.append({"model": model, "error": short_err})

    print("\n" + "=" * 60)
    print(f"SUMMARY: {len(working_models)} Working, {len(failed_models)} Failed/Non-Chat")
    print("=" * 60)

    with open("working_models.json", "w", encoding="utf-8") as f:
        json.dump(working_models, f, indent=2)

    print("Saved working models to working_models.json")

if __name__ == "__main__":
    main()
