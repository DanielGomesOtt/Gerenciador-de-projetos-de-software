<script lang="js" setup>

</script>

<template>
    <div class="h-8">
        <p class="text-black font-bold text-center text-2xl">Create a Task</p>
    </div>

    <div class="w-full mt-10">
        <div class="text-center text-red-600">{{ errorMessage }}</div>
        <form class="w-[100%]">
            <div>
                <label for="title-task" class="font-semibold">Title</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="title-task" name="title-task" placeholder="Task..." required>
            </div>

            <div class="mt-2">
                <label for="description-task" class="font-semibold">Description</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="description-task" name="description-task" placeholder="What needs to be done?" required>
            </div>

            <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                <div class="md:mr-2">
                    <label for="end-date-project" class="font-semibold">End Date</label>
                    <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="end-date-project" name="end-date-project" required>
                </div>
                <div class="md:ml-2">
                    <label for="priority-project" class="font-semibold">Priority</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="priority-project" name="priority-project" required>
                        <option value="Low Priority">Low Priority</option>
                        <option value="Medium Priority">Medium Priority</option>
                        <option value="High Priority">High Priority</option>
                    </select>
                </div>
            </div>
            <div class="mt-2">
                <label for="project-model" class="font-semibold">Project Model</label>
                <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="project-model" name="project-model" required>
                    <option value="default">Default</option>
                </select>
            </div>
        </form>
    </div>        
    <div class="h-10 mt-10">
        <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" >Create Project</button>
    </div>
</template>