let total = 0; // Total do pedido
let totalQuantity = 0; // Quantidade total de itens no carrinho
const cartItems = []; // Array para armazenar os itens do carrinho

// Função para carregar os pratos da API
async function loadDishes() {
    try {
        const response = await fetch('http://localhost:3000/api/pratos/antipasti'); // Substitua pela sua rota de antipasti
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const dishes = await response.json();
        displayDishes(dishes);
    } catch (error) {
        console.error('Erro ao carregar os pratos:', error);
    }
}

// Função para exibir os pratos na página
function displayDishes(dishes) {
    dishes.forEach(dish => {
        const dishElement = document.getElementById(`dish-${dish.id}`);
        if (dishElement) {
            const descriptionElement = dishElement.querySelector('p:nth-child(3)');
            const priceElement = dishElement.querySelector('p:nth-child(4)');
            descriptionElement.innerText = dish.description;
            priceElement.innerText = `€${dish.price.toFixed(2)}`;
            // Atualiza a função de ajustar quantidade com o preço correto
            dishElement.querySelector('button:nth-child(1)').setAttribute('onclick', `adjustQuantity(${dish.price}, 1, ${dish.id})`);
            dishElement.querySelector('button:nth-child(3)').setAttribute('onclick', `adjustQuantity(${dish.price}, -1, ${dish.id})`);
        }
    });
}

// Função para ajustar a quantidade no carrinho
function adjustQuantity(price, change, dishId) {
    const itemIndex = cartItems.findIndex(item => item.id === dishId);
    if (change < 0 && totalQuantity === 0) return; // Bloqueia a subtração se o total já é zero
    
    if (change > 0) {
        total += price; // Incrementa o total
        totalQuantity++; // Incrementa a quantidade total

        // Adiciona ou incrementa quantidade do item
        if (itemIndex > -1) {
            cartItems[itemIndex].quantity++;
        } else {
            cartItems.push({ id: dishId, price: price, quantity: 1 });
        }
    } else if (change < 0) {
        if (itemIndex > -1 && cartItems[itemIndex].quantity > 0) {
            total -= price; // Decrementa o total
            totalQuantity--; // Decrementa a quantidade total
            cartItems[itemIndex].quantity--;

            if (cartItems[itemIndex].quantity === 0) {
                cartItems.splice(itemIndex, 1); // Remove o item se a quantidade for 0
            }
        }
    }

    // Garante que total e totalQuantity nunca sejam negativos
    total = Math.max(0, total);
    totalQuantity = Math.max(0, totalQuantity);

    updateDisplay(); // Atualiza a exibição do carrinho
}

// Função para atualizar a exibição do carrinho
function updateDisplay() {
    document.getElementById("total-price").innerText = `€${total.toFixed(2)}`;
    document.getElementById("total-quantity").innerText = totalQuantity;
}

// Função para finalizar o pedido
async function finalizeOrder() {
    if (totalQuantity === 0) {
        alert('Adicione itens ao carrinho antes de confirmar o pedido.'); // Validação
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/pedidos', { // Substitua pela sua rota de pedidos
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartItems), // Envia os itens do carrinho
        });

        if (response.ok) {
            alert('Pedido confirmado com sucesso!');
            // Limpa o carrinho
            total = 0;
            totalQuantity = 0;
            cartItems.length = 0;
            updateDisplay(); // Atualiza a exibição após finalizar o pedido
        } else {
            throw new Error('Erro ao confirmar o pedido.');
        }
    } catch (error) {
        console.error('Erro ao confirmar o pedido:', error);
    }
}

// Adiciona o evento de clique ao botão de finalizar pedido
document.getElementById('finalize-order').addEventListener('click', finalizeOrder);

// Chama a função para carregar os pratos assim que a página carrega
window.onload = loadDishes;
