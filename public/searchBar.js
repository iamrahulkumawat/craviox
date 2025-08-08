
var data = {
  "home": "/dashboard",
  "dashboard": "/dashboard",
  "pages": "/extra_page",
  "create blogs": "/create_blog",
  "blog list": "/show_blogs",
  "create portfolio": "/create_portfolio",
  "/all portfolios": "/all_portfolios",
  "/portfolio list": "/all_portfolios",
  "write about us": "/about",
  "web services": "/web/service",
  "pending comments": "/pending-comments",
  "comment blogs": "/commentblogs",
  "pending feedbacks": "/pending_feedbacks",
  "all feedbacks": "/feedbacks",
  "schedule meetings": "/meetings",
  "add employee": "/add-account",
  "employee list": "/show-accounts",
  "mail": "/mail",
  "all tickets": "/all_ticket",
  "employee feedback": "/feedback/employee",
  "all contacts": "/show_contacts",
  "member list": "/show_contacts",
  "project list": "/project-list",
  "create project": "/add-project",
  "service list": "/service-list",
  "create service": "/service-list",
  "expense list": "/expense-list",
  "create expense": "/expense-list",
  "invoice list": "/invoice-list",
  "create invoice": "/create-invoice",
  "payment list": "/payments",
  "create payment": "/payments/create",
  "newsletter": "/email_dashboard",
  "tasks": "/tasks",
  "all notifications": "/notifications",
};

function showSuggestions() {
  var input = document.getElementById("searchInput").value.toLowerCase();
  var suggestions = [];
  var searchResults = document.getElementById("searchResults");
  
  if (input.length === 0) {
    searchResults.style.display = "none";
    return;
  }
  
  for (var key in data) {
    if (key.includes(input)) {
      suggestions.push(key);
    }
  }
  
  if (suggestions.length === 0) {
    searchResults.innerHTML = "No suggestions found.";
  } else {
    searchResults.innerHTML = "";
    suggestions.forEach(function(suggestion) {
      var suggestionElement = document.createElement("div");
      suggestionElement.textContent = suggestion;
      suggestionElement.className = "suggestion";
      suggestionElement.onclick = function() {
        window.location.href = data[suggestion];
      };
      searchResults.appendChild(suggestionElement);
    });
  }
  
  searchResults.style.display = "block";
}
