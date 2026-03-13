// Use global supabase client from supabase.js
// supabase is already initialized globally in supabase.js

async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("desc").value;
  if (!title) return alert("Enter task");

  const { error } = await supabase
    .from("tasks")
    .insert([{ title, description }]);

  if (error) {
    alert(error.message);
  } else {
    fetchTasks();
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
  }
}

async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("taskList");
  list.innerHTML = "";
  data.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.title + " - " + (task.description || "");
    list.appendChild(li);
  });
}

fetchTasks();
