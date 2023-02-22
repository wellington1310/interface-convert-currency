import { Fragment, useEffect, useRef, useState } from 'react';
import './App.css';

function Convert() {

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState("")
  const [resultBox, setResultBox] = useState(false)
  const [worldCurrencies, setWorldCurrencies] = useState([])
  const [loading, setLoading] = useState(false)


  const fromRef = useRef()
  const toRef = useRef()
  const amountRef = useRef()



  useEffect(() => {


    fetch(`https://economia.awesomeapi.com.br/json/last/USD,ARS,BOB,GBP,CAD,COP,DKK,EUR,ILS,MXN,NOK,PYG,PLN,RUB,SGD,SEK,TWD,THB,AED,UYU`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        const currencies = Object.keys(res).map(key => {
          return res[key];
        })

        setWorldCurrencies(currencies)


      })



  }, [])






  function convert() {
    setResultBox(false)
    setLoading(true)


    const data = {
      from: fromRef.current.value,
      to: toRef.current.value,
      amount: amountRef.current.value
    }


    // console.log("from:", fromRef.current.value,
    //   "to:", toRef.current.value,
    //   "amount:", amountRef.current.value);

    const option = {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(data)

    }

    fetch("/convert", option)
      .then(res => {
        return res.json()
      })
      .then(res => {
        const data = JSON.parse(res)
        if (data.success === true) {

          setFrom(data.query.from)
          setTo(data.query.to)
          setAmount(data.query.amount)
          setResult(data.result)
          setLoading(false)
          setResultBox(true)

        }



      })

  }





  return (
    <div className="container">
      <h1>converter</h1>


      <div className="inputs">


        <select className="input" name='from' ref={fromRef}  >

          <option value="BRL">Real Brasileiro</option>

          {worldCurrencies.map(coin => {
            return <option key={coin.name} value={coin.code} >

              {coin.name.replace("/Real Brasileiro", "")}

            </option>


          })}

        </select>

        <img src="./assets/seta.png" alt="seta" />

        <select className="input" name='to' ref={toRef} id="cars">

        <option value="BRL">Real Brasileiro</option>

          {worldCurrencies.map(coin => {

            return <option key={coin.name} value={coin.code} >

              {coin.name.replace("/Real Brasileiro", "")}

            </option>

          })}
          

        </select>


      </div>


      <input className="amount" ref={amountRef} type="number" name='amount' placeholder='   Valor' />

      <button className='button' onClick={convert}>converter</button>



      {loading ? <div className="loading"><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>
        : <Fragment/>}

      {resultBox ? <div className="result"> <h2>{from} - {Number(amount).toFixed(2).toString().replace(".", ",")}</h2> <p>equivale</p>
        <h2>{to} - {Number(result).toFixed(2).toString().replace(".", ",")}</h2> </div>
        : <Fragment />
      }


    </div>
  );
}

export default Convert;
