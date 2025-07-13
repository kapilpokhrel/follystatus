<script>
  import { statusCodeMap } from '../lib/status_codes.js';
  import { groupedStatusCodes } from '../lib/status_codes.js';
  let { selectedCode = $bindable() } = $props();

</script>

<label for="status-select">Grouped Drop down</label>
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
  select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
</style>

