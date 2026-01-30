document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    const modules = {
        dashboard: {
            title: 'Dashboard',
            subtitle: "Welcome back! Here's what's happening today.",
            render: renderDashboard
        },
        menu: {
            title: 'Menu Management',
            subtitle: 'Manage your restaurant items, categories, and prices.',
            render: renderMenu
        },
        orders: {
            title: 'Orders',
            subtitle: 'Track live orders and update their status.',
            render: renderOrders
        },
        inventory: {
            title: 'Inventory',
            subtitle: 'Monitor stock levels and manage supplies.',
            render: renderInventory
        },
        reports: {
            title: 'Reports',
            subtitle: 'Analyze your daily sales and performance.',
            render: renderReports
        },
        admin: {
            title: 'Admin Panel',
            subtitle: 'System settings and user management.',
            render: renderAdmin
        }
    };

    const navItems = document.querySelectorAll('.sidebar-nav li');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const moduleContainer = document.getElementById('module-container');
    const newOrderBtn = document.getElementById('new-order-btn');
    const orderModal = document.getElementById('order-modal');
    const newOrderForm = document.getElementById('new-order-form');

    // Menu Item Modal Elements
    const menuItemModal = document.getElementById('menu-item-modal');
    const newMenuItemForm = document.getElementById('new-menu-item-form');

    // Add Stock Modal Elements
    const addStockModal = document.getElementById('add-stock-modal');
    const addStockForm = document.getElementById('add-stock-form');

    function toggleOrderModal(show) {
        orderModal.style.display = show ? 'flex' : 'none';
        if (show) lucide.createIcons();
    }

    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', () => {
            const activeItem = document.querySelector('.sidebar-nav li.active');
            const currentModule = activeItem ? activeItem.getAttribute('data-module') : 'dashboard';
            if (currentModule !== 'orders') {
                switchModule('orders');
            }
            toggleOrderModal(true);
        });
    }

    function toggleMenuItemModal(show) {
        menuItemModal.style.display = show ? 'flex' : 'none';
        if (show) lucide.createIcons();
    }

    if (newMenuItemForm) {
        newMenuItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Menu Item Added Successfully!');
            toggleMenuItemModal(false);
            newMenuItemForm.reset();
        });
    }

    function toggleAddStockModal(show) {
        addStockModal.style.display = show ? 'flex' : 'none';
        if (show) lucide.createIcons();
    }

    // Global Event Delegation for Closing Modals and other static elements
    document.addEventListener('click', (e) => {
        const target = e.target;

        // Handle Close/Cancel buttons for all modals
        if (target.closest('#close-modal') || target.closest('#cancel-modal')) {
            toggleOrderModal(false);
        }
        if (target.closest('#close-menu-modal') || target.closest('#cancel-menu-modal')) {
            toggleMenuItemModal(false);
        }
        if (target.closest('#close-stock-modal') || target.closest('#cancel-stock-modal')) {
            toggleAddStockModal(false);
        }

        // Close on overlay click
        if (target.classList.contains('modal-overlay')) {
            toggleOrderModal(false);
            toggleMenuItemModal(false);
            toggleAddStockModal(false);
        }
    });

    if (addStockForm) {
        addStockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Stock Updated Successfully!');
            toggleAddStockModal(false);
            addStockForm.reset();
        });
    }

    if (newOrderForm) {
        newOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Order Created Successfully!');
            toggleOrderModal(false);
            newOrderForm.reset();
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleName = item.getAttribute('data-module');
            switchModule(moduleName);
        });
    });

    // Use event delegation for dynamic content only once
    moduleContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .edit-item-btn, .delete-item-btn, .update-status-btn, .edit-user-btn, .delete-user-btn');
        if (!target) return;

        if (target.id === 'view-all-orders') {
            switchModule('orders');
        } else if (target.id === 'add-menu-item-btn') {
            toggleMenuItemModal(true);
        } else if (target.id === 'add-stock-btn') {
            toggleAddStockModal(true);
        } else if (target.id === 'admin-save-settings') {
            const name = document.getElementById('admin-restaurant-name').value;
            const currency = document.getElementById('admin-currency').value;
            alert(`Settings Saved!\nRestaurant: ${name}\nCurrency: ${currency}`);
        } else if (target.id === 'admin-add-user') {
            const userName = prompt('Enter new user name:');
            if (userName) alert(`User "${userName}" added successfully!`);
        } else if (target.classList.contains('update-status-btn')) {
            const orderId = target.getAttribute('data-id');
            const newStatus = prompt(`Update status for ${orderId}:`, 'Preparing');
            if (newStatus) {
                alert(`Order ${orderId} status updated to: ${newStatus}`);
            }
        } else if (target.classList.contains('edit-item-btn')) {
            const itemName = target.getAttribute('data-name');
            const newName = prompt(`Edit item: ${itemName}`, itemName);
            if (newName) {
                alert(`Item updated to: ${newName}`);
            }
        } else if (target.classList.contains('delete-item-btn')) {
            const itemName = target.getAttribute('data-name');
            if (confirm(`Are you sure you want to delete ${itemName}?`)) {
                alert(`${itemName} deleted successfully!`);
            }
        } else if (target.classList.contains('edit-user-btn')) {
            const userName = target.getAttribute('data-name');
            const newRole = prompt(`Edit role for ${userName}:`, 'Admin');
            if (newRole) alert(`${userName}'s role updated to: ${newRole}`);
        } else if (target.classList.contains('delete-user-btn')) {
            const userName = target.getAttribute('data-name');
            if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
                alert(`User ${userName} removed!`);
            }
        }
    });

    function switchModule(name) {
        // Update active state in sidebar
        navItems.forEach(i => i.classList.remove('active'));
        document.querySelector(`[data-module="${name}"]`).classList.add('active');

        // Update header
        const module = modules[name];
        pageTitle.textContent = module.title;
        pageSubtitle.textContent = module.subtitle;

        // Render module content
        moduleContainer.innerHTML = '';
        module.render(moduleContainer);

        // Re-initialize icons for new content immediately after rendering
        lucide.createIcons();
    }

    // --- Module Renderers ---

    function renderDashboard(container) {
        container.innerHTML = `
            <div class="stats-grid">
                ${renderStatCard('revenue', 'Total Revenue', '$12,845.50', '+12.5%', 'trending-up', 'trend-up')}
                ${renderStatCard('orders', 'Today\'s Orders', '142', '+8.2%', 'trending-up', 'trend-up')}
                ${renderStatCard('stock', 'Low Stock Items', '12', '5 Critical', 'alert-triangle', 'trend-down')}
                ${renderStatCard('tables', 'Active Tables', '24/30', '80% Occupancy', 'users', 'trend-up')}
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3>Recent Orders</h3>
                    <button id="view-all-orders" class="btn btn-outline-primary">View All Orders</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-7342</td>
                            <td>Alex Johnson</td>
                            <td>Chicken Pasta, Iced Tea</td>
                            <td>$34.50</td>
                            <td><span class="status-pills status-preparing">Preparing</span></td>
                            <td>12 mins ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-7341</td>
                            <td>Sarah Miller</td>
                            <td>Beef Burger (x2)</td>
                            <td>$28.00</td>
                            <td><span class="status-pills status-ready">Ready</span></td>
                            <td>15 mins ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-7340</td>
                            <td>Michael Chen</td>
                            <td>Margarita Pizza</td>
                            <td>$18.50</td>
                            <td><span class="status-pills status-pending">Pending</span></td>
                            <td>18 mins ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderStatCard(type, label, value, trend, icon, trendClass) {
        return `
            <div class="stat-card" data-type="${type}">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="stat-trend ${trendClass}">
                        ${trend}
                    </div>
                </div>
                <div class="stat-info">
                    <span class="value">${value}</span>
                    <span class="label">${label}</span>
                </div>
            </div>
        `;
    }

    function renderMenu(container) {
        container.innerHTML = `
            <div class="data-table-container">
                <div class="table-header">
                    <h3>All Menu Items</h3>
                    <div class="table-actions">
                        <button id="add-menu-item-btn" class="btn btn-primary btn-sm"><i data-lucide="plus"></i> Add Item</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderMenuRow('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=40&h=40&fit=crop', 'Classic Cheeseburger', 'Main Course', '$12.99', 'Active')}
                        ${renderMenuRow('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=40&h=40&fit=crop', 'Margarita Pizza', 'Main Course', '$15.50', 'Active')}
                        ${renderMenuRow('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=40&h=40&fit=crop', 'Garden Salad', 'Starters', '$8.50', 'Active')}
                        ${renderMenuRow('https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=100&h=100&fit=crop', 'Iced Latte', 'Beverages', '$4.50', 'Out of Stock')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderMenuRow(img, name, cat, price, status) {
        const statusClass = status === 'Active' ? 'status-ready' : 'status-preparing';
        return `
            <tr>
                <td><img src="${img}" style="border-radius: 4px; width: 40px; height: 40px; object-fit: cover;"></td>
                <td><strong>${name}</strong></td>
                <td>${cat}</td>
                <td>${price}</td>
                <td><span class="status-pills ${statusClass}">${status}</span></td>
                <td>
                    <i data-lucide="edit-3" class="edit-item-btn" data-name="${name}" style="width:16px; cursor:pointer; margin-right:8px;"></i>
                    <i data-lucide="trash-2" class="delete-item-btn" data-name="${name}" style="width:16px; cursor:pointer; color:var(--danger)"></i>
                </td>
            </tr>
        `;
    }

    function renderOrders(container) {
        container.innerHTML = `
            <div class="orders-board">
                <style>
                    .orders-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
                    .order-column { background: #f1f5f9; padding: 1rem; border-radius: 1rem; min-height: 500px; }
                    .order-column h4 { margin-bottom: 1rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
                    .order-card { background: white; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; box-shadow: var(--shadow-md); border-left: 4px solid var(--primary); border: 1px solid var(--border); transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: default; }
                    .order-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
                    .order-card-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                    .order-id { font-weight: 700; font-size: 0.875rem; }
                    .order-time { font-size: 0.75rem; color: var(--text-muted); }
                    .order-items { font-size: 0.8125rem; margin-bottom: 0.75rem; }
                    .order-footer { display: flex; justify-content: flex-end; gap: 0.5rem; }
                </style>
                <div class="order-column">
                    <h4>Incoming (3)</h4>
                    ${renderOrderCard('#ORD-8821', '14:20', '2x Burger, 1x Coke', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=40&h=40&fit=crop')}
                    ${renderOrderCard('#ORD-8822', '14:22', '1x Pepperoni Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=40&h=40&fit=crop')}
                </div>
                <div class="order-column">
                    <h4>Preparing (2)</h4>
                    ${renderOrderCard('#ORD-8819', '14:15', '3x Tacos, 2x Lemonade', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=40&h=40&fit=crop', true)}
                </div>
                <div class="order-column">
                    <h4>Ready (4)</h4>
                    ${renderOrderCard('#ORD-8815', '14:05', '1x Steak, 1x Red Wine', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop', false, true)}
                </div>
            </div>
        `;
    }

    function renderOrderCard(id, time, items, img, isPreparing = false, isReady = false) {
        let border = 'var(--primary)';
        if (isPreparing) border = 'var(--warning)';
        if (isReady) border = 'var(--success)';

        return `
            <div class="order-card" style="border-left-color: ${border}">
                <div class="order-card-header">
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <img src="${img}" alt="Order Item" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                        <div>
                            <span class="order-id" style="display: block;">${id}</span>
                            <span class="order-time">${time}</span>
                        </div>
                    </div>
                </div>
                <div class="order-items" style="margin-top: 0.75rem;">${items}</div>
                <div class="order-footer">
                    <button class="btn btn-outline btn-sm update-status-btn" data-id="${id}" style="padding: 4px 8px; font-size: 11px;">Update Status</button>
                </div>
            </div>
        `;
    }

    function renderInventory(container) {
        container.innerHTML = `
            <div class="data-table-container">
                <div class="table-header">
                    <h3>Inventory Status</h3>
                    <button id="add-stock-btn" class="btn btn-primary btn-sm"><i data-lucide="package-plus"></i> Add Stock</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Ingredient</th>
                            <th>Stock Level</th>
                            <th>Unit</th>
                            <th>Min Level</th>
                            <th>Status</th>
                            <th>Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Chicken Breast</td>
                            <td>45</td>
                            <td>kg</td>
                            <td>10</td>
                            <td><span class="status-pills status-ready">Optimal</span></td>
                            <td>FreshFarms Ltd.</td>
                        </tr>
                        <tr>
                            <td>Tomatoes</td>
                            <td>4</td>
                            <td>kg</td>
                            <td>5</td>
                            <td><span class="status-pills status-preparing">Low Stock</span></td>
                            <td>City Wholesale</td>
                        </tr>
                        <tr>
                            <td>Burger Buns</td>
                            <td>120</td>
                            <td>pcs</td>
                            <td>50</td>
                            <td><span class="status-pills status-ready">Optimal</span></td>
                            <td>Bakery Express</td>
                        </tr>
                        <tr>
                            <td>Red Onions</td>
                            <td>15</td>
                            <td>kg</td>
                            <td>10</td>
                            <td><span class="status-pills status-ready">Optimal</span></td>
                            <td>Village Greens</td>
                        </tr>
                        <tr>
                            <td>Potato</td>
                            <td>60</td>
                            <td>kg</td>
                            <td>20</td>
                            <td><span class="status-pills status-ready">Optimal</span></td>
                            <td>Farm Fresh</td>
                        </tr>
                        <tr>
                            <td>Lettuce</td>
                            <td>3</td>
                            <td>kg</td>
                            <td>5</td>
                            <td><span class="status-pills status-preparing">Low Stock</span></td>
                            <td>City Wholesale</td>
                        </tr>
                        <tr>
                            <td>Cheddar Cheese</td>
                            <td>12</td>
                            <td>kg</td>
                            <td>5</td>
                            <td><span class="status-pills status-ready">Optimal</span></td>
                            <td>Dairy Delight</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderReports(container) {
        container.innerHTML = `
            <div class="stats-grid">
                ${renderStatCard('revenue', 'Today\'s Sales', '$1,240', '+15%', 'dollar-sign', 'trend-up')}
                ${renderStatCard('orders', 'Total Items Sold', '342', '+5%', 'shopping-bag', 'trend-up')}
                ${renderStatCard('tables', 'Avg. Order Value', '$24.50', '-2%', 'trending-down', 'trend-down')}
            </div>
            <div class="data-table-container">
                 <h3>Weekly Sales Overview</h3>
                 <div class="chart-wrapper">
                    <div class="chart-container">
                        <div class="chart-y-axis">
                            <span>$3k</span><span>$2k</span><span>$1k</span><span>0</span>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$1,250</div>
                            <div class="chart-bar" style="height: 40%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$2,100</div>
                            <div class="chart-bar" style="height: 65%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$1,850</div>
                            <div class="chart-bar" style="height: 50%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$2,800</div>
                            <div class="chart-bar" style="height: 85%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$1,150</div>
                            <div class="chart-bar" style="height: 35%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$2,450</div>
                            <div class="chart-bar" style="height: 75%;"></div>
                        </div>
                        <div class="chart-bar-group">
                            <div class="chart-tooltip">$2,950</div>
                            <div class="chart-bar" style="height: 95%;"></div>
                        </div>
                    </div>
                    <div class="chart-x-axis">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                 </div>
            </div>
        `;
    }

    function renderAdmin(container) {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="data-table-container">
                    <h3>System Settings</h3>
                    <div style="margin-top: 1rem;">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-size: 14px; margin-bottom: 5px;">Restaurant Name</label>
                            <input type="text" id="admin-restaurant-name" value="GastroFlow Premium" style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-size: 14px; margin-bottom: 5px;">Currency</label>
                            <select id="admin-currency" style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px;">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                        <button id="admin-save-settings" class="btn btn-primary" style="width: 100%;">Save Settings</button>
                    </div>
                </div>
                <div class="data-table-container">
                    <h3>User Management</h3>
                    <div style="margin-top: 1rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
                            <div>
                                <span style="display: block; font-weight: 600;">John Admin</span>
                                <span style="font-size: 12px; color: var(--text-muted);">Owner</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="status-pills status-ready">Active</span>
                                <i data-lucide="edit-2" class="edit-user-btn" data-name="John Admin" style="width: 14px; cursor: pointer;"></i>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
                            <div>
                                <span style="display: block; font-weight: 600;">Sarah Manager</span>
                                <span style="font-size: 12px; color: var(--text-muted);">Manager</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="status-pills status-ready">Active</span>
                                <i data-lucide="trash-2" class="delete-user-btn" data-name="Sarah Manager" style="width: 14px; cursor: pointer; color: var(--danger);"></i>
                            </div>
                        </div>
                        <button id="admin-add-user" class="btn btn-outline" style="margin-top: 1rem; width: 100%;">Add New User</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize with dashboard
    switchModule('dashboard');
});
