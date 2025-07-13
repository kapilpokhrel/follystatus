<script>
    import Card from "./Card.svelte";
    import { Messages } from "../lib/messages.svelte.js";

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
            class="nav-arrow"
            onclick={() => selectedMessages.prev()}
            disabled={selectedMessages.currentIndex == 0}
        >
            &lt;
        </button>
        <span class="card">
            <Card
                {selectedCode}
                currentMessage={selectedMessages.currentMessage}
            />
        </span>
        <button class="nav-arrow" onclick={() => selectedMessages.next()}
            >&gt;</button
        >
    {/if}
</div>

<style>
    .output_container {
        max-width: 600px;
        margin: auto;
        padding: 1rem;
        font-family: sans-serif;
    }
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 40px 20px;
    }

    .nav-arrow {
        width: 60px;
        height: 60px;
        text-align: center;
        font-size: 2.4rem;
        cursor: pointer;
        user-select: none;
        transition: color 0.2s ease;
        flex-shrink: 0;
        border-radius: 50%;
        display: inline-block;
        border: none;
        background-color: transparent;
    }
    
    .card {
        flex-grow: 1;
    }

    .nav-arrow:hover {
        color: #2d3748;
    }

    /* Optional: Make it mobile responsive */
    @media (max-width: 768px) {
        .container {
            flex-direction: column;
            gap: 16px;
        }

        .nav-arrow {
            display: none;
        }
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top: 4px solid #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
