<script>
    import { statusCodeMap } from "$lib/status_codes.js";
    let { selectedCode, currentMessage } = $props();
</script>

<div class="card">
    <div class="card-code">
        {selectedCode}: {statusCodeMap[parseInt(selectedCode)]}
    </div>
    <div class="card-message">{currentMessage}</div>
</div>

<style>
    .card {
        background: linear-gradient(to top right, #ffffff, #f9fafb);
        border: 3px solid #e2e8f0;
        border-radius: 1rem;
        padding: 2rem;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .card-code {
        font-family: JetBrainsMono;
        font-size: 2.25rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1rem;

        /*jusitfy-content is necessary for satori*/
        justify-content: center;
    }

    .card-message {
        font-family: EduVICWANTBeginner;
        font-size: 1.5rem;
        font-weight: 500;
        color: #2a2528;
        line-height: 1.6;
        justify-content: center;
    }
</style>
