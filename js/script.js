let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

// Navbar Toggle
document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
  searchForm.classList.remove('active');
  cartItem.classList.remove('active');
};

// Search Form Toggle
document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active');
  navbar.classList.remove('active');
  cartItem.classList.remove('active');
};

// Cart Toggle
document.querySelector('#cart-btn').onclick = () => {
  cartItem.classList.toggle('active');
  navbar.classList.remove('active');
  searchForm.classList.remove('active');
};

// Close All on Scroll
window.onscroll = () => {
  navbar.classList.remove('active');
  searchForm.classList.remove('active');
  cartItem.classList.remove('active');
};

// Open Modal
function openModal() {
  document.getElementById("orderModal").style.display = "flex";
}

// Close Modal
function closeModal() {
  document.getElementById("orderModal").style.display = "none";
  resetOrder();
}

// Reset Order
function resetOrder() {
  document.getElementById("total-price").textContent = "0₺";
  document.querySelector("#order-table tbody").innerHTML = "";
  document.querySelectorAll(".coffee-quantity").forEach(input => input.value = 0);
}

// Calculate Order
function calculateOrder() {
  let total = 0;
  const orderTableBody = document.querySelector("#order-table tbody");
  orderTableBody.innerHTML = "";

  document.querySelectorAll(".coffee-quantity").forEach(input => {
    const qty = parseInt(input.value);
    const coffeeName = input.dataset.coffee;
    const price = parseFloat(input.dataset.price);

    if (qty > 0) {
      const itemTotal = qty * price;
      total += itemTotal;

      const row = `<tr>
                      <td>${coffeeName}</td>
                      <td>${qty}</td>
                      <td>${price}₺</td>
                      <td>${itemTotal}₺</td>
                   </tr>`;
      orderTableBody.innerHTML += row;
    }
  });

  document.getElementById("total-price").textContent = `${total}₺`;
}

// Update Cart After Confirming Order
function sendToCart() {
  cartItem.innerHTML = "";
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Add items to the cart from local storage
  cartItems.forEach(item => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.innerHTML = `
      <input type="checkbox" class="item-checkbox" data-id="${item.coffeeName}">
      <span class="item-name">${item.coffeeName}</span>
      <span class="item-qty">Adet: ${item.qty}</span>
      <span class="item-price">${item.itemTotal}₺</span>
      <span class="customer-name">Müşteri Adı: ${item.clientName}</span>
      <span class="table-number">Masa Numarası: ${item.tableNumber}</span>
      <button class="delete-btn">Sil</button>
    `;
    cartItem.appendChild(cartItemDiv);
  });

  // Checkbox functionality for cart items
  document.querySelectorAll(".item-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function(e) {
      const itemDiv = e.target.parentElement;
      const coffeeName = itemDiv.querySelector('.item-name').textContent;
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const item = cartItems.find(cartItem => cartItem.coffeeName === coffeeName);
      if (item) {
        item.selected = e.target.checked;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Toggle the styling (red and strikethrough)
        const itemNameSpan = itemDiv.querySelector('.item-name');
        if (e.target.checked) {
          itemNameSpan.style.color = 'red';  // Apply red color
          itemNameSpan.style.textDecoration = 'line-through';  // Add strikethrough
        } else {
          itemNameSpan.style.color = '';  // Remove color
          itemNameSpan.style.textDecoration = '';  // Remove strikethrough
        }
      }
    });
  });

  // Delete item functionality
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", function(e) {
      const itemDiv = e.target.parentElement;
      const coffeeName = itemDiv.querySelector('.item-name').textContent;
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems = cartItems.filter(item => item.coffeeName !== coffeeName);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      sendToCart();  // Re-render the cart after deleting
    });
  });

  // Add hover effect and bold styling to "Sil" button
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("mouseover", function() {
      button.style.color = "red";  // Change color to red on hover
      button.style.fontWeight = "bold";  // Make text bold on hover
    });

    button.addEventListener("mouseout", function() {
      button.style.color = "";  // Reset color when mouse leaves
      button.style.fontWeight = "";  // Reset font weight when mouse leaves
    });
  });
}

// Confirm Order (Ensuring At Least One Item Is Selected)
function confirmOrder() {
  const clientName = document.getElementById("client-name").value.trim();
  const tableNumber = document.getElementById("table-number").value.trim();
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (!clientName || !tableNumber) {
    alert("Müşteri adı ve masa numarası gerekli!");
    return;
  }

  // Check if at least one item has been selected
  let itemSelected = false;
  document.querySelectorAll(".coffee-quantity").forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      itemSelected = true;
    }
  });

  if (!itemSelected) {
    alert("Lütfen en az bir ürün seçin!");
    return;  // Stop the order process if no item is selected
  }

  // If items are selected, proceed with adding them to the cart
  document.querySelectorAll(".coffee-quantity").forEach(input => {
    const qty = parseInt(input.value);
    const coffeeName = input.dataset.coffee;
    const price = parseFloat(input.dataset.price);

    if (qty > 0) {
      const itemTotal = qty * price;
      const cartItem = {
        coffeeName: coffeeName,
        qty: qty,
        itemTotal: itemTotal,
        clientName: clientName,
        tableNumber: tableNumber
      };

      // Add the new item to the localStorage
      cartItems.push(cartItem);
    }
  });

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  sendToCart();  // Update the cart UI after confirming
  alert(`Sipariş onaylandı!\nMüşteri: ${clientName}\nMasa: ${tableNumber}\nToplam: ${document.getElementById("total-price").textContent}`);
  closeModal();  // Close the modal after order confirmation
}

// Email Form Submission
function sendEmail(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !phone || !message) {
    alert("Lütfen tüm alanları doldurunuz.");
    return;
  }

  const mailtoLink = `mailto:masteryoda@starwars.com?subject=İletişim Talebi&body=Ad: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0ATelefon: ${encodeURIComponent(phone)}%0D%0AMesaj: ${encodeURIComponent(message)}`;
  window.location.href = mailtoLink;

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("message").value = "";
}

// Event Listeners
document.querySelectorAll(".coffee-quantity").forEach(input => {
  input.addEventListener("input", calculateOrder);
});

window.openModal = openModal;
window.closeModal = closeModal;
window.confirmOrder = confirmOrder;

// Initialize Cart on Page Load
window.onload = () => {
  sendToCart();  // Load cart items from localStorage when the page loads
};
