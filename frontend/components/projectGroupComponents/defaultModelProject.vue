<script lang="js" setup>

</script>

<template>
    <div class="w-screen mt-24">
        <div class="flex w-full justify-around items-center">
            <h1 class="font-bold text-5xl">Tasks</h1>
            <UButton
                icon="i-heroicons-plus-solid"
                size="sm"
                color="blue"
                variant="solid"
                label="New task"
                :trailing="false"
            />
        </div>
        <div class="mt-10 w-full flex justify-center">
            <table class="table-auto w-[80%] border-2 border-gray-200">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>