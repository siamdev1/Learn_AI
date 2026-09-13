import os
import sys
import time
import threading
from openai import OpenAI

# Verified working Chat & Reasoning models on NVIDIA NIM Free Endpoints
AVAILABLE_MODELS = [
    {
        "id": "nvidia/nemotron-3-super-120b-a12b",
        "name": "Nemotron 3 Super 120B",
        "category": "Flagship MoE",
        "supports_thinking": True,
        "desc": "120B MoE with 1M context, strong reasoning & coding"
    },
    {
        "id": "meta/llama-3.2-11b-vision-instruct",
        "name": "Meta Llama 3.2 11B Vision Instruct",
        "category": "Fast Chat & Vision",
        "supports_thinking": False,
        "desc": "Ultra-fast (<0.6s) general chat and reasoning model"
    },
    {
        "id": "nvidia/nemotron-3.5-lightning-30b-a3b",
        "name": "Nemotron 3.5 Lightning 30B",
        "category": "Agentic / LLM",
        "supports_thinking": True,
        "desc": "Fastest 30B MoE with reasoning for agentic tasks"
    },
    {
        "id": "openai/gpt-oss-20b",
        "name": "OpenAI GPT-OSS 20B",
        "category": "Reasoning & Math",
        "supports_thinking": False,
        "desc": "Efficient text-only MoE specialized in reasoning and math"
    },
    {
        "id": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        "name": "Nemotron 3 Nano Omni 30B",
        "category": "Omni-Modal / Reasoning",
        "supports_thinking": True,
        "desc": "Omni-modal reasoning model with thinking capabilities"
    },
    {
        "id": "google/diffusiongemma-26b-a4b-it",
        "name": "Google DiffusionGemma 26B",
        "category": "Diffusion LLM",
        "supports_thinking": False,
        "desc": "Diffusion-based 26B LLM enabling parallel token generation"
    },
    {
        "id": "meta/muse-glimmer-30b",
        "name": "Meta Muse Glimmer 30B",
        "category": "Multimodal Reasoning",
        "supports_thinking": False,
        "desc": "Multimodal reasoning model with tool-calling capabilities"
    },
    {
        "id": "nvidia/riva-translate-4b-instruct-v2",
        "name": "Riva Translate 4B Instruct V2",
        "category": "Translation & Polyglot",
        "supports_thinking": False,
        "desc": "Super-fast translation model across 37 languages"
    },
    {
        "id": "nvidia/ising-calibration-1.5-31b",
        "name": "NVIDIA Ising Calibration 1.5 31B",
        "category": "Quantum & Technical VLM",
        "supports_thinking": False,
        "desc": "Multimodal model built on Gemma 4 for technical & scientific text"
    },
    {
        "id": "nvidia/nemotron-3.5-content-safety",
        "name": "Nemotron 3.5 Content Safety",
        "category": "Safety & Moderation",
        "supports_thinking": False,
        "desc": "Multilingual model for detecting safety and moderation"
    }
]

KEY_FILE = ".nvidia_key"

class LiveSpinner:
    """Thread-safe live animated progress bar / spinner on terminal."""
    def __init__(self, message="Connecting to NVIDIA server"):
        self.message = message
        self.stop_event = threading.Event()
        self.thread = None
        self.start_time = None

    def _spin(self):
        frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        idx = 0
        bars = [
            "░░░░░░░░░░", "█░░░░░░░░░", "██░░░░░░░░", "███░░░░░░░", "████░░░░░░",
            "█████░░░░░", "██████░░░░", "███████░░░", "████████░░", "█████████░", "██████████"
        ]
        while not self.stop_event.is_set():
            elapsed = time.perf_counter() - self.start_time
            frame = frames[idx % len(frames)]
            bar = bars[(idx // 2) % len(bars)]
            sys.stdout.write(f"\r\033[K\033[1;36m{frame}\033[0m \033[33m[{bar}]\033[0m \033[37m{self.message}\033[0m \033[90m({elapsed:.1f}s)\033[0m")
            sys.stdout.flush()
            idx += 1
            time.sleep(0.08)
        sys.stdout.write("\r\033[K")
        sys.stdout.flush()

    def start(self):
        self.start_time = time.perf_counter()
        self.stop_event.clear()
        self.thread = threading.Thread(target=self._spin, daemon=True)
        self.thread.start()

    def update(self, new_message):
        self.message = new_message

    def stop(self):
        if self.thread and self.thread.is_alive():
            self.stop_event.set()
            self.thread.join(timeout=0.5)

def get_api_key():
    # 1. Environment variable
    api_key = os.environ.get("NVIDIA_API_KEY", "").strip()
    if api_key and api_key != "$NVIDIA_API_KEY":
        return api_key

    # 2. Saved key file
    if os.path.exists(KEY_FILE):
        try:
            with open(KEY_FILE, "r", encoding="utf-8") as f:
                saved_key = f.read().strip()
                if saved_key:
                    return saved_key
        except Exception:
            pass

    # 3. Prompt user on terminal
    print("\033[1;36m" + "=" * 65)
    print(" NVIDIA API Key Setup")
    print("=" * 65 + "\033[0m")
    try:
        api_key = input("Enter your NVIDIA API Key: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\nAborted.")
        sys.exit(0)

    if not api_key:
        print("\033[1;31m[!] No API key provided. Exiting.\033[0m")
        sys.exit(1)

    try:
        with open(KEY_FILE, "w", encoding="utf-8") as f:
            f.write(api_key)
    except Exception:
        pass

    return api_key

def display_model_menu(current_idx=0):
    print("\n\033[1;36m" + "=" * 80)
    print(f" Verified Active Models on NVIDIA NIM ({len(AVAILABLE_MODELS)} Models Tested & Online):")
    print("=" * 80 + "\033[0m")

    for i, m in enumerate(AVAILABLE_MODELS):
        selected = " \033[1;32m★ ACTIVE\033[0m" if i == current_idx else ""
        thinking_badge = "\033[33m[🧠 Thinking]\033[0m" if m["supports_thinking"] else ""
        cat_badge = f"\033[35m[{m['category']}]\033[0m"

        print(f" \033[1m[{i + 1:2d}]\033[0m {m['name']} {cat_badge} {thinking_badge}{selected}")
        print(f"      \033[90mID: {m['id']} | {m['desc']}\033[0m")
    print("=" * 80)

def choose_model(current_idx=0):
    display_model_menu(current_idx)
    while True:
        try:
            choice = input(f"\nSelect model (1-{len(AVAILABLE_MODELS)}) [Enter to keep current #{current_idx + 1}]: ").strip()
            if not choice:
                return current_idx
            idx = int(choice) - 1
            if 0 <= idx < len(AVAILABLE_MODELS):
                print(f"\033[1;32m✓ Selected: {AVAILABLE_MODELS[idx]['name']}\033[0m")
                return idx
            print(f"\033[31mPlease enter a number between 1 and {len(AVAILABLE_MODELS)}.\033[0m")
        except ValueError:
            print("\033[31mInvalid input. Please enter a valid number.\033[0m")
        except (KeyboardInterrupt, EOFError):
            return current_idx

def call_model_stream(client, model_info, messages):
    """
    Streams completion with live spinner and timeout protection.
    Returns: (full_content, ttft, total_duration)
    """
    model_id = model_info["id"]
    spinner = LiveSpinner(f"Connecting to {model_info['name']}")
    spinner.start()

    start_time = time.perf_counter()
    ttft = None
    has_printed_thinking_header = False
    has_printed_content_header = False
    full_content = ""

    kwargs = {
        "model": model_id,
        "messages": messages,
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 4096,
        "stream": True,
        "timeout": 15.0
    }

    if model_info.get("supports_thinking", False):
        kwargs["extra_body"] = {"chat_template_kwargs": {"enable_thinking": True}}

    try:
        spinner.update(f"Sending request to {model_info['name']}")
        try:
            completion = client.chat.completions.create(**kwargs)
        except Exception as e:
            if "extra_body" in kwargs:
                spinner.update("Retrying without extra parameters...")
                kwargs.pop("extra_body", None)
                completion = client.chat.completions.create(**kwargs)
            else:
                raise e

        spinner.update(f"Waiting for first token from {model_info['name']}")

        for chunk in completion:
            if not chunk.choices:
                continue

            delta = chunk.choices[0].delta
            reasoning = getattr(delta, "reasoning_content", None)
            content = delta.content

            if ttft is None and (reasoning or content):
                ttft = time.perf_counter() - start_time
                spinner.stop()

            if reasoning:
                if not has_printed_thinking_header:
                    print("\033[90m[🧠 Thinking]\n", end="", flush=True)
                    has_printed_thinking_header = True
                print(reasoning, end="", flush=True)

            if content:
                if has_printed_thinking_header and not has_printed_content_header:
                    print("\033[0m\n\n\033[1;37m[💬 Answer]\033[0m\n", end="", flush=True)
                    has_printed_content_header = True
                print(content, end="", flush=True)
                full_content += content

    finally:
        spinner.stop()

    print("\033[0m")
    total_duration = time.perf_counter() - start_time
    return full_content, ttft, total_duration

def main():
    api_key = get_api_key()

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
        timeout=15.0
    )

    # Start with Nemotron 3 Super 120B by default (#1)
    model_idx = 0
    model_idx = choose_model(model_idx)

    print("\n\033[1;32m✓ Ready to chat!\033[0m")
    print("Commands:")
    print(" - \033[1m/model\033[0m : Switch active model")
    print(" - \033[1m/clear\033[0m : Clear conversation history")
    print(" - \033[1m/exit\033[0m  : Quit chat")
    print("-" * 65)

    messages = [
        {"role": "system", "content": "You are a helpful and intelligent AI assistant."}
    ]

    while True:
        current_model = AVAILABLE_MODELS[model_idx]

        try:
            user_input = input(f"\n\033[1;34mYou [{current_model['name']}]:\033[0m ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting chat. Goodbye!")
            break

        if not user_input:
            continue

        if user_input.lower() in ["/exit", "exit", "quit", ":q"]:
            print("Exiting chat. Goodbye!")
            break

        if user_input.lower() in ["/clear", "clear"]:
            messages = [{"role": "system", "content": "You are a helpful and intelligent AI assistant."}]
            print("\033[32m[✓] Conversation history cleared.\033[0m")
            continue

        if user_input.lower() in ["/model", "model"]:
            model_idx = choose_model(model_idx)
            continue

        messages.append({"role": "user", "content": user_input})

        # Automatic Failover Handling
        attempt_idx = model_idx
        tried_indices = set()
        success = False

        while attempt_idx not in tried_indices and len(tried_indices) < len(AVAILABLE_MODELS):
            tried_indices.add(attempt_idx)
            active_model = AVAILABLE_MODELS[attempt_idx]

            print(f"\n\033[1;32mAssistant ({active_model['name']}):\033[0m")

            try:
                full_content, ttft, total_duration = call_model_stream(client, active_model, messages)

                if not full_content.strip():
                    raise RuntimeError("Model returned an empty response.")

                messages.append({"role": "assistant", "content": full_content})

                # Performance Stats
                print("\033[2m" + "-" * 45)
                print(f"⏱️  Time to First Token (TTFT): {ttft:.3f}s" if ttft else "⏱️  TTFT: N/A")
                print(f"⌛ Total Response Time:        {total_duration:.3f}s")
                print(f"🤖 Endpoint:                   {active_model['id']}")
                print("-" * 45 + "\033[0m")

                # If failover succeeded, switch permanently
                if attempt_idx != model_idx:
                    print(f"\033[33m[i] Switched to active model: {active_model['name']}\033[0m")
                    model_idx = attempt_idx

                success = True
                break

            except Exception as e:
                err_msg = str(e)
                print(f"\n\033[1;31m[Error with {active_model['name']}]: {err_msg}\033[0m")

                next_idx = (attempt_idx + 1) % len(AVAILABLE_MODELS)
                while next_idx in tried_indices and len(tried_indices) < len(AVAILABLE_MODELS):
                    next_idx = (next_idx + 1) % len(AVAILABLE_MODELS)

                if len(tried_indices) < len(AVAILABLE_MODELS):
                    fallback_model = AVAILABLE_MODELS[next_idx]
                    print(f"\033[1;33m⚠️ Switching to next working model: #{next_idx + 1} {fallback_model['name']}...\033[0m")
                    attempt_idx = next_idx
                    time.sleep(1)
                else:
                    break

        if not success:
            print("\033[1;31m[!] All models failed. Please verify your NVIDIA API key or network.\033[0m")
            if messages and messages[-1]["role"] == "user":
                messages.pop()

if __name__ == "__main__":
    main()
