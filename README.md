# Tron Sunswap Dashbot

The Tron Sunswap Dashbot is a not yet a comprehensive web application built using **Next.js** and **React**, designed to provide users with seamless interaction with the **TRON blockchain** and the **Sunswap decentralized exchange**.

---
<img width="842" alt="Screenshot 2025-01-01 at 17 19 31" src="https://github.com/user-attachments/assets/6b024ab2-2c5b-452e-a3f4-00ca5bf093e8" />

## Features

### 1. Wallet Management
- Generate a new TRON wallet or connect an existing one.
- View wallet details, including wallet address, TRX balance, and token balances.
- Label wallets for easy identification.

### 2. Token Transfer
- Send TRX or other tokens to specified addresses.
- Includes a confirmation step to minimize accidental transactions.

### 3. Token Swapping
- Perform token swaps directly through Sunswap.
- Utilize the **Sunpump** feature for specific token pairs.
- Swap interface provides estimated output and price impact information.

### 4. Token Information
- Access detailed information about tokens on the TRON network.
- View token holders, recent transactions, and other relevant details.

### 5. Token Creation and Launch
- Create and launch new tokens using a user-friendly wizard.
- Set token parameters, provide initial liquidity, and launch tokens on Sunswap.

### 6. King of the Hill Feature
- Displays the top-performing token on Sunswap.
- Visualize recent token events using interactive charts.

### 7. Transfer History
- View past transactions with details such as transaction hash, amount, and status.

### 8. Documentation
- Comprehensive guides for token creation, launching, and Sunpump usage.

### 9. Responsive Design
- Optimized for both desktop and mobile devices.

### 10. Error Handling and Feedback
- Implements error boundaries.
- Provides user feedback via toast notifications.

### 11. Theming
- Custom color scheme:
  - **Primary colors**: `#FF9D3D` and `#F6B17A`
  - **Font color**: `#1E201E`

### 12. API Integration
- Interacts with the TRON blockchain via **TronWeb** and custom API routes.
- Integrates with external APIs to fetch additional token data.

---

## Getting Started

### Prerequisites
- **Node.js** and **npm** installed.
- Access to a TRON wallet.
- Basic knowledge of blockchain and decentralized exchanges.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yllvar/sunpump-dashbot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sunpump-dashbot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```

Access the application in your browser at:
```
http://localhost:3000
```

---

## Usage

### Connecting a Wallet
- Click on **"Connect Wallet"**.
- Choose to generate a new wallet or connect an existing one.

### Performing a Token Swap
- Navigate to the **Swap** section.
- Select tokens and input the desired amounts.
- Review the estimated output and price impact before confirming.

### Creating a Token
- Open the **Token Creation** wizard.
- Set parameters like token name, symbol, and supply.
- Add liquidity and launch your token on Sunswap.

---

## Technologies Used
- **Next.js**: Framework for server-rendered React applications.
- **React**: Frontend library for building user interfaces.
- **TronWeb**: JavaScript library for interacting with the TRON blockchain.
- **Sunswap API**: For token swap and liquidity pool interactions.
- **Chart.js**: Visualizing token performance data.

---

## Contributing
We welcome contributions to enhance the Tron Sunswap Dashboard. Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- Thanks to the TRON community for their support.
- Special recognition to the Sunswap team for their API and platform.

---

## Contact
For support or inquiries:
- Email: [support@example.com](mailto:support@example.com)
- GitHub Issues: [Submit an issue](https://github.com/your-username/tron-sunswap-dashboard/issues)

