import { getLocale } from "next-intl/server"

import { getAllCurrencies } from "@/helpers/currency"

export default async function Currencies() {
  const locale = await getLocale()
  const currencies = getAllCurrencies(locale)
  const currenciesArray = []
  for (const index in currencies) {
    if (Object.prototype.hasOwnProperty.call(currencies, index)) {
      currenciesArray.push(currencies[index])
    }
  }
  return (
    <div>
      <ul>
        {currenciesArray.map((currency, index) => (
          <li key={index}>
            {currency.name}
          </li>
        ))}
      </ul>
    </div>
  )
}