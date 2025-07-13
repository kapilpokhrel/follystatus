<script>
    import { statusCodeMap } from "../lib/status_codes.js";
    let { selectedCode, currentMessage } = $props();
</script>

<div class="card">
    <span>
        <strong>{selectedCode}: {statusCodeMap[parseInt(selectedCode)]}</strong>
    </span>
    <span>{currentMessage}</span>
</div>

<style>
    .card {
        background: linear-gradient(to bottom right, #ffffff, #f9fbfc);
        border: 3px solid #e2e8f0;
        border-radius: 12px;
        max-width: 520px;
        margin: 20px 10px;
        padding: 30px 40px;
        text-align: center;
    }

    .card span:first-child {
        display: block;
        font-size: 1.8rem;
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 14px;
    }

    .card span:last-child {
        font-size: 1.2rem;
        color: #4a5568;
        line-height: 1.6;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
