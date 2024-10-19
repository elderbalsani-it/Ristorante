// Importando o módulo mysql2 para conexão com o banco de dados
const mysql = require('mysql2/promise');

// Configuração da conexão ao banco de dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Er220504@',
    database: 'ristorante'
});

// Funções para PRATOS
async function getPratos() {
    const query = `SELECT * FROM pratos`;
    const [rows] = await db.query(query);
    return rows;
}

async function criarPrato({ nome, descricao, preco, categoria }) {
    const query = `INSERT INTO pratos (nome, descricao, preco, categoria) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(query, [nome, descricao, preco, categoria]);
    return result;
}

// Funções para PEDIDOS
async function getPedidos() {
    const query = `
        SELECT pedidos.id, pedidos.mesa, pratos.nome AS prato, pedidos.quantidade, pedidos.status
        FROM pedidos
        JOIN pratos ON pedidos.prato_id = pratos.id;
    `;
    const [rows] = await db.query(query);
    return rows;
}

async function criarPedido({ mesa, prato_id, quantidade, status }) {
    const query = `
        INSERT INTO pedidos (mesa, prato_id, quantidade, status)
        VALUES (?, ?, ?, ?);
    `;
    const [result] = await db.execute(query, [
        mesa,
        prato_id,
        quantidade,
        status || 'em preparo' // Valor padrão para status
    ]);
    return result;
}

// Função para atualizar o status de um pedido
async function atualizarStatusPedido(id, status) {
    const query = `UPDATE pedidos SET status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [status, id]);
    return result;
}

// Exportando as funções para uso em outros arquivos
module.exports = {
    getPratos,
    criarPrato,
    getPedidos,
    criarPedido,
    atualizarStatusPedido // Exportando a nova função
};
