const API_URL = 'https://crud-application-with-fastapi-backend.onrender.com'; // Replace with your Render backend URL

// Load items on page load
document.addEventListener('DOMContentLoaded', loadItems);

// Handle create form submission
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    
    try {
        const response = await fetch(`${API_URL}/items/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });
        
        if (response.ok) {
            document.getElementById('createForm').reset();
            loadItems();
            showNotification('Item created successfully!', 'success');
        }
    } catch (error) {
        console.error('Error creating item:', error);
        showNotification('Error creating item', 'error');
    }
});

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const description = document.getElementById('editDescription').value;
    
    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });
        
        if (response.ok) {
            closeModal();
            loadItems();
            showNotification('Item updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showNotification('Error updating item', 'error');
    }
});

async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items/`);
        const items = await response.json();
        
        const itemsList = document.getElementById('itemsList');
        
        if (items.length === 0) {
            itemsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <p>No items found. Create your first item!</p>
                </div>
            `;
            return;
        }
        
        itemsList.innerHTML = items.map(item => `
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-300">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(item.name)}</h3>
                        <p class="text-gray-600 mt-1">${escapeHtml(item.description)}</p>
                        <div class="text-sm text-gray-400 mt-2">
                            <span>Created: ${new Date(item.created_at).toLocaleDateString()}</span>
                            <span class="mx-2">•</span>
                            <span>Updated: ${new Date(item.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editItem(${item.id})"
                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-300">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteItem(${item.id})"
                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading items:', error);
        showNotification('Error loading items', 'error');
    }
}

async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/items/${id}`);
        const item = await response.json();
        
        document.getElementById('editId').value = item.id;
        document.getElementById('editName').value = item.name;
        document.getElementById('editDescription').value = item.description;
        
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading item for edit:', error);
        showNotification('Error loading item', 'error');
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                loadItems();
                showNotification('Item deleted successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('Error deleting item', 'error');
        }
    }
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } animate-fade-in`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);