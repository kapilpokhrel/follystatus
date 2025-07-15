<script>
    import Card from "./Card.svelte";
    import { Messages } from "../lib/messages.svelte.js";
    import { draw, fade } from "svelte/transition";

    let { selectedCode, prompt } = $props();
    const codeMessages = new Map();

    let selectedMessages = $derived.by(() => {
        let selectedMessages = codeMessages.get(selectedCode);
        if (!selectedMessages || selectedMessages.prompt != prompt) {
            let newMessages = new Messages(selectedCode, prompt);
            codeMessages.set(selectedCode, newMessages);
            return newMessages;
        }
        return selectedMessages;
    });
</script>

<div class="container">
    {#if selectedMessages.length === 0}
        <div class="spinner"></div>
    {:else}
        <button
            class="nav-side nav-arrow nav-prev"
            onclick={() => selectedMessages.prev()}
            disabled={selectedMessages.currentIndex == 0}
        >
            &lt;
        </button>
        {#key selectedMessages.currentMessage}
            <div class="card-container" in:fade>
                <Card
                    {selectedCode}
                    currentMessage={selectedMessages.currentMessage}
                />
            </div>
        {/key}
        <button
            class="nav-side nav-arrow nav-next"
            onclick={() => selectedMessages.next()}
        >
            &gt;
        </button>
        <div class="nav-bottom">
            <button
                class="nav-arrow nav-prev"
                onclick={() => selectedMessages.prev()}
                disabled={selectedMessages.currentIndex == 0}
            >
                &lt;
            </button>
            <button
                class="nav-arrow nav-next"
                onclick={() => selectedMessages.next()}
            >
                &gt;
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
        color: #4a5568;
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
