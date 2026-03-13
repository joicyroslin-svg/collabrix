let total = 0;
let completed = 0;
let aiUsed = 0;

document.addEventListener("DOMContentLoaded", () => {
  const hour = new Date().getHours();
  let greetingText = "Welcome";

  if (hour < 12) greetingText = "Good Morning";
  else if (hour < 18) greetingText = "Good Afternoon";
  else greetingText = "Good Evening";

  const greeting = document.getElementById("greeting");
  if (greeting) greeting.innerText = `${greetingText}, Student!`;
});

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value;

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  total++;
  document.getElementById("total").innerText = total;

  const li = document.createElement("li");
  li.innerHTML = `
        ${taskText}
        <button onclick="completeTask(this)">Done</button>
    `;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function completeTask(btn) {
  btn.parentElement.style.textDecoration = "line-through";
  completed++;
  document.getElementById("completed").innerText = completed;
}

function aiSuggestion() {
  const suggestions = [
    "Prepare project documentation",
    "Assign roles to team members",
    "Design UI wireframes",
    "Test all features"
  ];

  const randomTask = suggestions[Math.floor(Math.random() * suggestions.length)];
  aiUsed++;
  document.getElementById("aiCount").innerText = aiUsed;

  alert("AI Suggestion: " + randomTask);
}
