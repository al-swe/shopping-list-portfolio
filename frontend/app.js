document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("table tbody");
  const addButton = document.getElementById("add-button");
  const api = "https://fs-shopping-list-backend.vercel.app";

  async function fetchItems() {
    try {
      const response = await fetch(`${api}/items`);
      const items = await response.json();

      const tableHead = document.getElementById("table-head");
      tableBody.innerHTML = "";

      if (items.length === 0) {
        tableHead.style.display = "none";

        const row = document.createElement("tr");
        const noItemsCell = document.createElement("td");
        noItemsCell.textContent = "No items added";
        noItemsCell.colSpan = 3;
        noItemsCell.style.textAlign = "center";
        row.appendChild(noItemsCell);
        tableBody.appendChild(row);
      } else {
        tableHead.style.display = "";

        items.forEach((item) => {
          const row = document.createElement("tr");

          const itemNameCell = document.createElement("td");
          itemNameCell.textContent = item.name;

          const itemAmountCell = document.createElement("td");
          itemAmountCell.textContent = item.amount;

          const deleteCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "🗙";
          deleteButton.addEventListener("click", () => deleteItem(item.id));
          deleteCell.appendChild(deleteButton);

          row.appendChild(itemNameCell);
          row.appendChild(itemAmountCell);
          row.appendChild(deleteCell);

          tableBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function addItem(name, amount) {
    try {
      const response = await fetch(`${api}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          amount: amount,
        }),
      });

      if (response.ok) {
        fetchItems();
        clearInputs();
      } else {
        console.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  async function deleteItem(itemId) {
    try {
      const response = await fetch(`${api}/items/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchItems();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  function clearInputs() {
    document.getElementById("item").value = "";
    document.getElementById("amount").value = 1;
  }

  addButton.addEventListener("click", () => {
    const itemName = document.getElementById("item").value;
    const itemAmount = parseInt(document.getElementById("amount").value, 10);

    if (itemName && itemAmount > 0) {
      addItem(itemName, itemAmount);
    } else {
      console.error("Invalid item name or amount");
    }
  });

  fetchItems();
});
