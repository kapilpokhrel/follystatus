<script>
    import { statusCodeMap } from "../lib/status_codes.js";
    import { groupedStatusCodes } from "../lib/status_codes.js";
    let { selectedCode = $bindable() } = $props();
</script>

<label for="status-select">HTTP Status Code</label>
<select id="status-select" bind:value={selectedCode}>
    {#each Object.entries(groupedStatusCodes) as [group, codes]}
        <optgroup label={group}>
            {#each codes as code}
                <option value={code}>{code} - {statusCodeMap[code]}</option>
            {/each}
        </optgroup>
    {/each}
</select>

<style>
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #4a5568;
    }
    select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 0.5rem;
        background-color: #fff;
        font-size: 1rem;
        line-height: 1.5;
        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    select:focus {
        outline: none;
        border-color: #112d4e;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.7);
    }
</style>
