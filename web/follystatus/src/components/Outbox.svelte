<script>
    import Card from "$components/Card.svelte";
    import '@fortawesome/fontawesome-free/css/all.min.css'
    import { Messages } from "$lib/messages.svelte.js";
    import { draw, fade } from "svelte/transition";

    let { selectedCode, prompt, initMsg = "" } = $props();
    const codeMessages = new Map();

    let selectedMessages = $derived.by(() => {
        let selectedMessages = codeMessages.get(selectedCode);
        if (!selectedMessages || selectedMessages.prompt != prompt) {
            let newMessages = new Messages(selectedCode, prompt, initMsg);
            codeMessages.set(selectedCode, newMessages);
            return newMessages;
        }
        return selectedMessages;
    });

    function shareCard() {
        const msg = encodeURIComponent(selectedMessages.currentMessage);
        const urlPrompt = encodeURIComponent(prompt);

        const baseUrl = window.location.origin + window.location.pathname;
        const url = `${baseUrl}?code=${selectedCode}&msg=${msg}&prompt=${urlPrompt}`;

        navigator.clipboard.writeText(url)
          .then(() => alert("Link copied to clipboard!"))
          .catch(err => alert("Failed to copy link"));
    }

</script>

<div class="container">
    {#if selectedMessages.length === 0}
        <div class="spinner"></div>
    {:else}
        <button
            class="nav-side nav-arrow nav-prev"
            onclick={() => selectedMessages.prev()}
            disabled={selectedMessages.currentIndex == 0}
            aria-label="previous"
        >
            <i class="fa-solid fa-circle-arrow-left"></i>
        </button>
        {#key selectedMessages.currentMessage}
            <div class="card-container" in:fade>
                <Card
                    {selectedCode}
                    currentMessage={selectedMessages.currentMessage}
                />
                <button onclick={shareCard} aria-label="share">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        {/key}
        <button
            class="nav-side nav-arrow nav-next"
            onclick={() => selectedMessages.next()}
            aria-label="next"
        >
            <i class="fa-solid fa-circle-arrow-right"></i>
        </button>
        <div class="nav-bottom">
            <button
                class="nav-arrow nav-prev"
                onclick={() => selectedMessages.prev()}
                disabled={selectedMessages.currentIndex == 0}
                aria-label="previous"
            >
                <i class="fa-solid fa-circle-arrow-left"></i>
            </button>
            <button
                class="nav-arrow nav-next"
                onclick={() => selectedMessages.next()}
                aria-label="next"
            >
                <i class="fa-solid fa-circle-arrow-right"></i>
            </button>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem 0;
    }

    .nav-arrow {
        width: 50px;
        height: 50px;
        font-size: 2rem;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
        flex-shrink: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #cbd5e0;
        background-color: #fff;
        color: #3F72AF;
    }

    .nav-arrow:hover {
        background-color: #f7fafc;
        border-color: #a0aec0;
    }

    .nav-arrow:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .nav-bottom {
        display: none;
    }

    .card-container {
        flex-grow: 1;
        aspect-ratio: 16/9;
        max-width: 560px;
        min-width: 300px;
        position: relative;
    }
    
    .card-container button {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: #3F72AF;
        color: white;
        border: none;
        border-radius: 999px;
        padding: 0.4rem 0.6rem;
        cursor: pointer;
        font-size: 0.9rem;
        z-index: 1;
    }
    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #e2e8f0;
        border-top: 5px solid #4299e1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 680px) {
        .container {
            flex-direction: column;
            gap: 1.5rem;
        }

        .nav-side {
            display: none;
        }

        .nav-bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            width: 100%;
        }

        .card-container {
            width: 100%;
        }
    }
</style>
