
        var currentPage = 1;
        var entriesPerPage = 5;
    
        function updateTable() {
            var select = document.getElementById("entries");
            entriesPerPage = parseInt(select.options[select.selectedIndex].value);
            currentPage = 1;
            renderTable();
        }
    
        function renderTable() {
            var table = document.getElementById("dataTable");
            var rows = table.rows.length - 1; // Exclude header row
    
            var startIndex = (currentPage - 1) * entriesPerPage + 1;
            var endIndex = Math.min(startIndex + entriesPerPage - 1, rows);
    
            // Show selected number of rows
            for (var i = 1; i <= rows; i++) {
                table.rows[i].style.display = i >= startIndex && i <= endIndex ? "" : "none";
            }
    
            renderPagination();
        }
    
        function renderPagination() {
            var table = document.getElementById("dataTable");
            var rows = table.rows.length - 1; // Exclude header row
            var totalPages = Math.ceil(rows / entriesPerPage);
    
            var paginationPageNumbers = document.getElementById("paginationPageNumbers");
            var paginationNavigation = document.getElementById("paginationNavigation");
    
            paginationPageNumbers.innerHTML = "";
            paginationNavigation.innerHTML = "";
    
            // Previous Button
            var previousBtn = document.createElement("a");
            previousBtn.href = "#";
            previousBtn.textContent = "Previous";
            previousBtn.classList.add("btn", "bg-secondary", "text-white", "rounded-none", "hoverbtn");
            previousBtn.addEventListener("click", function (event) {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                }
                event.preventDefault();
            });
            paginationNavigation.appendChild(previousBtn);
    
            // Display Current Page Info for paginationNavigation
            var pageInfoNavigation = document.createElement("button");
            pageInfoNavigation.textContent = currentPage;
            pageInfoNavigation.classList.add("btn", "bg-primary", "text-white", "rounded-none");
            paginationNavigation.appendChild(pageInfoNavigation);
    
            // Display Current Page Info for paginationPageNumbers
            var pageInfoNumbers = document.createElement("span");
            pageInfoNumbers.textContent = "Showing " + currentPage + " to " + totalPages + " entries ";
            pageInfoNumbers.classList.add("page-info");
            paginationPageNumbers.appendChild(pageInfoNumbers);
    
            // Next Button
            var nextBtn = document.createElement("a");
            nextBtn.href = "#";
            nextBtn.textContent = "Next";
            nextBtn.classList.add("btn", "bg-secondary", "text-white", "rounded-none", "hoverbtn");
            nextBtn.addEventListener("click", function (event) {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                }
                event.preventDefault();
            });
            paginationNavigation.appendChild(nextBtn);
        }
    
        function searchTable() {
            // Declare variables
            var input, filter, table, tr, td, i, txtValue;
            input = document.getElementById("searchInput");
            filter = input.value.toUpperCase();
            table = document.getElementById("dataTable");
            tr = table.getElementsByTagName("tr");
    
            // Loop through all table rows, and hide those that don't match the search query
            for (i = 0; i < tr.length; i++) {
                tds = tr[i].getElementsByTagName("td");
                for (j = 0; j < tds.length; j++) {
                    td = tds[j];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                            break;
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        }
    
        // Initial call to set the default value
        renderTable();
    