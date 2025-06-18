import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [convertedAmount, setConvertedAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Popular currencies list
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
  ]

  // Fetch exchange rate from API
  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const data = await response.json()
      const rate = data.rates[toCurrency]

      if (!rate) {
        throw new Error('Currency not supported')
      }

      setExchangeRate(rate)
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.')
      console.error('Exchange rate fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Convert currency
  const convertCurrency = () => {
    if (amount && exchangeRate) {
      const result = (parseFloat(amount) * exchangeRate).toFixed(2)
      setConvertedAmount(result)
    } else {
      setConvertedAmount('')
    }
  }

  // Fetch exchange rate when currencies change
  useEffect(() => {
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  // Convert when amount or exchange rate changes
  useEffect(() => {
    convertCurrency()
  }, [amount, exchangeRate])

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>💱 Currency Converter</h1>
          <p>Convert between different currencies with real-time exchange rates</p>
        </header>

        <div className="converter-card">
          <div className="input-section">
            <div className="currency-input">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="amount-input"
              />
            </div>

            <div className="currency-selectors">
              <div className="currency-select">
                <label htmlFor="from-currency">From</label>
                <select
                  id="from-currency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="currency-dropdown"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="swap-button"
                onClick={swapCurrencies}
                title="Swap currencies"
              >
                ⇄
              </button>

              <div className="currency-select">
                <label htmlFor="to-currency">To</label>
                <select
                  id="to-currency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="currency-dropdown"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="result-section">
            {loading && <div className="loading">Loading exchange rate...</div>}

            {error && <div className="error">{error}</div>}

            {!loading && !error && exchangeRate && (
              <div className="result">
                <div className="conversion-result">
                  <span className="converted-amount">
                    {convertedAmount ? `${currencies.find(c => c.code === toCurrency)?.symbol}${convertedAmount}` : '--'}
                  </span>
                  <span className="currency-code">{toCurrency}</span>
                </div>

                {amount && (
                  <div className="exchange-info">
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Exchange rates provided by exchangerate-api.com</p>
          <p>Rates are updated regularly but may not reflect real-time market rates</p>
        </footer>
      </div>
    </div>
  )
}

export default App
