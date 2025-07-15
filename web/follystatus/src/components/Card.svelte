<script>
    import { statusCodeMap } from "../lib/status_codes.js";
    let { selectedCode, currentMessage } = $props();
</script>

<div class="card">
    <div>
        <strong>{selectedCode}: {statusCodeMap[parseInt(selectedCode)]}</strong>
    </div>
    <div>{currentMessage}</div>
</div>

<style>
    .card {
        background: linear-gradient(to top right, #ffffff, #f9fafb);
        border: 3px solid #e2e8f0;
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .card div:first-child {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1rem;
    }

    .card div:last-child {
        font-size: 1.25rem;
        color: #4a5568;
        line-height: 1.6;
    }
</style>
