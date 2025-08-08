
var data = {
    "home": "/p_dashboard",
    "dashboard": "/p_dashboard",
    "all tickets": "/all_ticket",
    "mail": "/mail",
    "employee feedback": "/all/feedback",
    "tasks": "/tasks",
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
  