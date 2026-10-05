// Name: Browser
// ID: browser
// Description: Adds blocks for interacting with the browser.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

(function (Scratch) {
  'use strict';

  //67
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension needs to be unsandboxed to run!');
  }

  const salvarArquivo = (nome, href) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = nome;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const converterValor = (valor) => {
    if (valor !== null && typeof valor === 'object') {
      return JSON.stringify(valor);
    }
    if (valor === undefined || valor === null) {
      return '';
    }
    return valor;
  };

  const lerCabecalhos = (texto) => {
    try {
      const obj = JSON.parse(texto);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        return obj;
      }
    } catch (e) {}
    return {};
  };

  class ExtensaoRequisicoes {
    getInfo() {
      return {
        "menuIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAADXUAAA11AFeZeUIAAAgAElEQVR4Ae2dTahe1bnH9ylBjGjAGB1ob6IoJFcqGKFY9WIHbeikvUId2ZEfgwradmSw0FKhhdI48mPQDqwd1cm1EO6oN3VQuQmVgmfQYiMYNGnjQBOFRDzgDeSe55w8593vPvtjrfU8z/rY678h2e+79/p41v9Z+3eetfba+125fPlyM7Td/+OdQ6dwfH4KDHeEPNq6kocZsMJagRO/XBusYsfQGcBqSJlij+cOpClhx+wHzKbUm8n5QWDNpH21NmPs4p6jJn3tBcRm6OkvzbBNNTaJLtj2vxo16La5rUcf0Lrp8T0TBcZGd70R1liGTNpUuxm4AP17QFczRGD+GibP0Qus5FbBgD4FuhdcXxocc1egqycA5q5dspQrfJcQUVUyHwxV3L2ghtLhuL4CgJe+psEltu8artz37NXBBSGjugKAlLqk4gIBL7GEegVgSKinZWhJgFSocnHytf0DeMXRfLAWAGtQGvMT7QvBvDJUoKIA+wzgUpHTvxAAy18zSQ7u8JIykDe9Am0/Al4R/QFgxRG73cHj1IhaYinAvgW4IigOYNmKzJ3ZthaUnoMCbV8DXkYeAbBshG13XpsaUGrOCrD/AS5lLwFYuoJyR9UtFaWVqgD3B4BLyYN4llBHSOqY3Dl1SkQpc1IAfUPJm4iwZEIW3RF37rqqueb6q2QKRMz9+adfNGsXvohYo2pV3FcQbQlkBbDCxeMOGF5CpJxDYNpz665mpaDL5/KtTXPugwvbVCsMZNxvClJ+m+TJDgBY/tJzh/PPGSlHF1ClgWlIJoLrjbft2na6D2QFQIz7EcC1zaPDBwCsYW26Z7iDdY8n/z5XQLkK2weyLsQyBhj1K0DL0dkA1rRQ2YGqdkBNu2ydAJ1orA2wDOHFfQzgmnAugDUuEHek8VQRzrYhNZchXgTZtqpoAyxjeHF/A7i2PLf8AcBa1oO/ccfh70n2gJSN7AXAi/sfwNXpAgDWsiDcUZaPRv7GoEIkZS985vCi/ghotboBgLUQIymsGFJkDkC1cErMT5nCi/slwLXeGQCsxCvUGVSAVEw0TdfVB6/Ek/WItgCsdI/TAFTT0MglBcOLJ+sTgqt6aNUaYXGYHfWaYEhRpYiookqvUlkm4OK+W+UQsUZgscNVOrFrIQSrvQf3FPUojGvbakuXEbiqg1ZNwEoGKnrAGBHV/LCWAbi4T1cDrlqAxY6NdtXw8A+giiZ5sora4Dqzei7FGyWof1cBrRqAFRVWAFUybiSvmMBFw356o0SCiXnu57MG19yBxU6M0pkxTxVF5qwraUdbCcE1W2jNFVjRQYV5qqw5Et24xOCi/j9LaM0RWNFgheFfdA4UV2EbXJHnt2YJrbkBKwqsAKriuJHc4ETzW7OD1pyAFQ1WWE+V/Pov0oB2tBVxfmtW0JoLsMxhhaiqSEZkaXQbXJGGiXx9FD+vNQdgsTPMOifu/plJW3XBCYaJxUdbpQPLFFaIqqrmSZTGJ4q2io20SgaWOawwVxXlmkUl6wpEjraKjbRKBZYZrBBVgR+pFIgcbRUJrRJ/qt4UVhRV0W/fUefBBgVSKMDRFv3xNN7MriUru0sDlpnAmFi36mIoN0QBhtYN+65tjMFldk2FtHsqT0nAMhMWsJrqJjifQgEeIlLUD2hteqAUYJnAijoB/QXD5HqKyxF1uirA0Rag1TQlAMsMVpivcr1kkC61AoDWpgdyB5YprKgTYIMCpSgAaOUdYQFWpVxJsDOaAgwt48l4k2tPQ6RcIywTwTC5rtFlUEZqBQhatPTGeDLe5BqUapcjsEyEAqykXQX5c1OAoy3jyfismp0bsACrrLoHjMldAWNomVyPEk1zApaJOIisJN0DeUtQoCZo5QIswKqEKwM2ZqtALdDKAViAVbaXAQwrSYEaoJUDsNT7BIaB6pKiwEIUmDu0UgNLPboCrAq5smCmmQJzhlZKYAFWZl0WBdeugDG0ksmbCliAVTKXo+JaFCBo0Q/8Gmzq16+rjamA5WqfUzoMA51kQqIKFdhz6y6rV9MkgVYKYKk2FLCq8CpEk50VMB4aql7LLo2KDSzVBgJWLi5GmtoVMIZWVHljAguwiupaVAYFFgoYQkv1ul5Y3P8pJrD6LQg4isgqQDRkqV6BOUArFrDUKAxYVX/dQQCBAobQEljlnjUGsNRgRc2i27QkOjYoAAXCFDCClup1PtSyGMAaqtv7OEVXdJsWGxSAAjIFCFoGa7TMoWUNLLUGYCgo66DIDQW6Chiu0epWpfbdGlgqhgJWKjKiECiwpECJQ0NLYKlEV4DVUh/DFyigqkBp0LIClgqsyDOYZFftn+aF7d99b3PkwT83v/3WqebQvkfN60MFcgWMoCU3rKeElfuevbrnsPiQCrAQXYn9EK0AAtTYdvjNrzfn1v41lgTnEivw8fsXmvOnP9O0Qv1+vkWEBVhpunwmZVHUhS1vBUqYhNeOsFRgRW6lH4qk317Dlq8CT3zlSPPALQ97G/j4H2/3zoMMcRS4vH4Fn1k916xd+EKrQtUoyyLCEjeUhoJYbyWW0bSA5+7/7yBYkVFTw0dTw1H4qAIG67PUghgyXBNYKoZh3mq0PwWdfOTAT1Qh8fTBXzd7r7szyBbOpAktivI0y2Mba93nPDTUHBKqAAtDQb3LpH0Raw3D2mVKLf380oXm6TcOSovZyN+267kT32nOXHxHpdxaC8l1aKgVYanACkNB+eWxZ+eXN6KN9gUsL3WzBBoGam7X7NilFhm1gUx2Uvsfuv2HmuZWVZbB0FBFPy1giY3BUFAs4cZFank3TjoMHGqhVbkP3fGjDU0I4tj8FVAeGqoENRrAUjEEC0T9O1Q7x1hE1Y4+2nl8Po+V71NOX1rtyK1bBy9k7R7H93EFcoyypMBSgRWGguMdZ+wsgcQSJmN1a57TaMPRUy+OmqRRx2gFMzyZW5S1IweNEV25e4GiEZ8hVO7RlXvLp1Mefe+F5vP/u9DQXdGhrQstDX2G6prDcX5sR3ltVrA0kggL0VWw7P4ZeYI6NqwOf/X3/sYG5ujCJKSYY6df9cpGdWJyflwy5aGhiBsSYI230vEsois3oV7+xqpbQuVUB9YfZo65adQ3NTTstocn57vH8X2hgPLQcFGw56dQYIkoyTZi7oqVGN+HwOqVvx8eL9ThLC0Qjb1pRHQ0NMSmq0AuUVYosMRqYBnDtIS8Qp2Gg77b8bOv+2ZZSk+rx++56dDSsVhffIa9mjbR8DDk2UhNG3IuK4coKwRYKtEVhoLjXZMunkP7HhtPNHD23U/eGjjjfpgebE61aSxzCJ1Mp3ZrzKWl0s6y3hyirBBgiTXBUHBcQukF86u/fm+8gomzT9z1/EQK+9NSDaQWUv2ItrarmDrK8gUWoqvtPlQ7QkOw1BcqNeaBm7+r1qaUBb28+qSoeoq2NKI9kRGZZU4dZfk+/CwGFuau+nugBqhWP/pT89Lq9/srcDyqYYdjVU7JQod2XPjzD77Z3LDzFv4q2kttEVWeUWblB6O93pflE2GJYUWaY+5qe8/TgoQUViGT+9tbo3tEGuFIh8e6rZlHaSmjLB9gidXG3NV2CbVgtb1k/yMhyyf8a/HLIb1jSO+RX7t00a/SgdQ5+WrAxGiHU81lRQUWoqvl/qR5ARw7/bvlwmf0jRZ2Sran3rhbkn0pL/ksx0h0ycgIX1JFWa7AEg8HEV0t9yJNWFHJr538+XIFnt9yjK64Cbk9OkNaAVrNxmvM6bqOubkCS2wToquFhNqwWpQc/in3C1Bq3/EP/xAuTk9OQKtplKOsHpW3H3IBFqKr7boFH8kRVsGNiZhRGgG+8rdn1K2V2qRuUIICFeeynDjjAiyxDIiuNiUErMRdKbsCavdp7CjLHFiYu7KHFa2/kmyPHPipJHv1eQlaNYMrZpQ1BSynMG2sxyK6ahqNNxCMaSxdf3Vo36NjxeMcFBhVIGaUNQWsUUOnTiK6ajbeDqrxjqcprUPP/+Dgb0KzRs8X+jB4LENrntNSjLJG3WUKLERXjfmzaOfXzo46eOrkwZu+OZUkm/Njrz52MVLrNxCH6qI7mblDdch26XHFKGt0VDcGrNGM0gbWkD/GvMYzbz5Yg5RbbZTMt9EPt1pvUqha21d6+WPAErWt9uFgDFiJHLSeuaThILe1hPm2EnzPemruYwwLzYCF4aBmV7Apq6ThoJYC/7z4D62iRsuRPk40WnimJ2MMC4eAheGgoFPE+gsrXc4gaGLSrJJfcv7ZiW9HsT23x4miNHq9EusoawhYovbVPByMBStykGQ5Q853Lqc6H/2ScwlbzL6Qix6KUVZvk0yAVeNwkO4QldRBrdeG9fa2TA7GfLMF9YkUvz6UUmqlKKt3lNcHrN6EKQUooe7Ya3BiXnQ56i9577z0zRa+eqT69SFfO7XSW0ZZfcAS2V3zcFAknGdmyUUnudg9zTRLXtp750uKvs2cplCwOrBqHA4q+CFqEaVd7FHFQWU5KbBttKcOrJxaG8uW2BFLrXcHNf0pfUJA05Y5lqU0j7VNmi6wthFtW46RA7UOB2NHLJK7gyPuK+6UZK3TS8KfAAsRS7IcI6S+lHms5rG6wBK1scbhYOzJdpGD1jPP6Vk3yVqnMxffkUrpnb+U5RjeDYuYQRVYEe3Opirpq3tjNwTPui0UTzEsrOnXpJWGhUujPgBr0X+9PtG8VYo7P6+d/IWXnXNPLFkykOLBcfo16VqgZTEsbANriWS+Hb22+avY81bsj+NnX+eP2K8rUOIQl6CFLUyBNrDCSriSq6b5q5TDQMkrUmLfzRR1KMfM+3ff65gyr2Q1P2kg8YQasCRGlJa3tIl21jdVVMj1Y79QoORnORetmP6kPY8FYE1rjhQzVuDoqReTta7E4ayvWNrzWAwszF85eiJldBXrXU6OUmSTbO91dwbbcvS9F4LzSjPijq2/ggws/5ytHJi/aolh+DHlxWXYLHHRuPDFEhZTgAqwimmt0NDUt6Pf/uhYcAskq8KDK42UsdSJd5InxdKYSG7ZqkZpHmujPABrS9bpDyXfjpasCp9WBikkCqS86yyx2zWv0jzWxrSVGFi1rL+SLFB0dSzSpVHg3U/eSlPxlVpTzosmbXhA5QQs0YR7LfNXtb01MqAvJc0iebD4fz/EYtykzvOoXBxhedSFpAIFUkcBAtOjZJXML+bw9IAEuFEEzqQSACsTR0yZcez0q1NJqj5f+hwd3uTg1n0BLDedkqeS3CFMbjwMqF4BrTuFAFb1XQkCQAF7BZTuFDYiYNVyh9DenagBCkABBwUui4BVyx3C0hf3zX2dj0NHn0yyduniZBokSK+ACFjpzYcFLgocuvUxl2RVp/kf3NQowv8A1oSb5vBIy4Hry3xn1IRrVE+/+8lfVMsLKQyLk6dVA7AmNCr9djk1r+Rn7Sbco3b6ZOLV7tQQLE6edieANa0RUkABKJCJAgBWJo6AGVAACkwrAGBNa4QUUCCaAnOYM7UUC8AaUbeW926PSIBTkRWYw5zpkGQaq90BrCF114/jl01GxMnwFP7AZOiUlkkaq90BrJag+AgFoEDeCgBYefsH1nkosH/31zxSI2mJCgBYJXoNNkOBShUAsCp1/BybPZcV/ZiLG+6dK/c9e3XwK5Jv2Hdtc+Ntu4ZLxxkoAAWgQEuBj9+/0Jw//VnriN9HRFh+eiE1FIACCRUAsBKKj6qhABTwUwDA8tMLqaEAFEioAICVUHxUDQWggJ8CAJafXkgNBaBAQgUArITio2ooAAX8FACw/PRCaigABRIqAGAlFB9VQwEo4KcAgOWnF1JDASiQUAEAK6H4qBoKQAE/BQAsP72QGgpAgYQKAFgJxUfVUAAK+CkAYPnphdRQAAokVGBHwrqzrzqnn6h//I+3B+uVUzuCG+GYcQ46Hfnr95ocfifRUfKoyRBhRZUblVkq8G4GP4aq0T7AalhFAGtYG5yBAlAgMwUArMwcAnPCFTj56VvhmZGzCAUArCLcBCNdFHj3k7+4JEOaghUAsEacR5Of2MpRAHM/5fgq1FIAa0Q5XAAj4uCUiQJHT71oUm4OhV5e//WIzz/9QmQKgCWSD5mhgK4CR997QbfAjEo798GFZu0CgJWRS2AKFIAClgogwrJUF2VDASigqgCANSHnHOYUjn/4h4lW4nQOP1768uqTcMSEAgDWhEBzmFM4fva/JlqJ0/t3fy25CG9/dCy5DbkbAGDl7iEF+3C3c1rEQ/senU6EFMkVALAcXCB5oNaheCTJQIFrduzKwAqYMKWACFi0poLWVmCDAlAACsRQQAQsWlNBayuwQQEoAAUiKLAiAlYEA1HFFQXuuekQtIACxSqgscqdGg9gFdIFDu17rBBL05hZ+ruwDr/59TTCRapVY5U7mQpgRXKYtJr9u++VFjHr/EdPhT/S8sAtDyfX5tzav5LbUIIBAJajl7Coz1GoRMkkSzf+4+b0wEokW3HVErBWJFbXcqcQi/okvSTvvKmj16ffOJi3QBlZJ46warpT+MrfD2fkOj9T5vCIkV+Ly0n9+SXcaXf1lhhYrhXNId3xs68nbYbkTuEcHjEaEv/82tmhU9kfr2FRstIdwo2RIIDl2aVTXhz/eccPPa2tI/lrJ39eR0MLbaXWHUJqvgqwapnHIsGeefNB2iXZ9l53Z5J6c69UMr/40B0/Sta8107+IlndpVbMwBJNvNc0j1Wqo2F3vwIP3Z4uaj12+tV+o3B0UAEG1mACnNiuQKl3dTDxvt2XqY6UvtDVVTel+aut6gCsLSncP5R6V+fYB/iL7u5l25S/quQXmZTmr7ZGgGrAqmkei7pyqrd4Sh7RKRW0Y+gocR6o5OUxY76Ica4NrC2KhVRc2zzWK397pklxS/qRAz8Jcc9s80jmgY48+OfouhCsUi+Pid5oxQrbwFIstp6i1i5dLKqx+Ou+cNeenV9efIn0qSZYac9fkYsALGFHfeqNu4UlxM0+pwtGMixP8aMTc38jQ7cna89fUfmqwKptHosdJLlwuAyf/Q8O/sYn+WzT0rA8dHv8K0dCswbnwxsZgqXbytgFFuaxtqRx/yC5cNxrWaQ8eNM3F1/wKUiBFMPBIEORaUmBLrCWTuLLPBU4dvp382wYWpWNAhbzV9Q4dWDVOiyM3VMeOfDT4Crn8OxdaQsvU9xRDu4gChkt5q/ILHVg1ba8gX0be/V77b+jJ1l4KYE9+9tnv/rRn3ySF5/WKroiYfqAJZrHKl7twAbQosyUb3IINLvKbLFh/9Lq96vSWSm66tWsD1i9CX0O1jospDc5xAz9JXcLY9rp03dc0j534jsuyZKnIY1L1jmxgL2Bkwmwah0WsoNjPS5S693CMxffYam99ylfJ+NtbIEZLIeDJMcQsHrpVqB+SUyWPC4S0+DY68ditm2orlivk6k1srIcDpJPh4A15G/n47UOC1mgEjps7PVjrI1kXwJkS/C9xAcp85oBq/ZhITk1RsdN8QBvyg4rgew1O3aZm17zs5qKw8HBEd4YsAYzmXt9RhVYTxBLV2yXELFwd5AueH35G6tclMme7hLP6VlNX5Gsh4NkzxiwfO3dlr72YSEJQhPEOS9ylEQs2xxufCD3Ba8p3/dvLP1k8TGiKzLCFFgYFm76WbLIcbKnrCeQLG+g8mPd1XRpC9KUqUCM6IqUmQKWeFiIKGuzA1rOZ0mXN5RyVzPXS5l8a+nfXNvNdilGV1zk4H4KWIMZXU8gylooVXOnXqgwr0/wadMoRleTAZI5sKh7IspaXKTo4AstfD5JX373xF3P+1TnlDb286NORkVOFDO6oqa5AGuSelMaIcpaVihHaOX+HKT05XcP3PzdZScIvxGs5vijHr6yxIyuyDYXYPm2oTc9oqxlWbShJX0DQc53uHJbegFYbfbl2NEV1eoKLERZy7xR+aYJrdhvIFARwLEQ6dILzfVX5DNEVpuOU4yuHHuCO7CcC0RCPwU0oeVX8/bUc12lrbXCfa76bO8J00eUoyvngMg1wppugUMKDAv7RdKClnQ9Vo6rtKUT25qPLuWoT3+Psj+aIrqiVvkAy5mCQ3LR5PuZ1XMN0RnbsgIErSPCny+n9Vi//dap5YI9v2nB07Pa3uTSuaJ7bjrUSB9d+ufFf2ysscpJl16xIh5MFV1RE32ApSIJ7hgOy3jyk7eyWIB49NSLw0ZGPCOdK3r64K9F1tIfkJ+d+LaojDlmThVdkZa+wBJHWVQphoakwvAm/Wt++Ku/Hy7c4czR915wSGWbRKqB1Dqqn/6AYFtWIGV0RZb4AmvZ+sBviLKmhaMLJvTtBBq/avzy6pPTRhqlkA6NyazQoTG1OzUsjWRVKTZldEUNCAEWoiwV108XQm8nkE46T9fSn+Ltj471n4hwNFVkQw+Bp2x3BGlFVaSOrsj4EGCJGs2ZEWWxEuN7mscJ+YsfGmG0rQmpt50/5LPG0oHQRbR4CHzcY6mjK7IuFFiIssZ9q342VaQV+zf1NJYO+C6ipZsMKeCs3kkMC8whuqLmhQJLRRosc3CXkSMtn5cBakRZMX9TTwMah/Y95i7qekqqM4ebDF5GJ0icQ3RFzV6579mrJc1XWVF1w75rmxtvs3/ftqShueZ1gZIGCFzqkWoktZN+wmvqV3GkdUjbWGJ+iq5o/SQFGAqbaHSWNMLixmOZAyvhv6cLcA4XoUYbACv//uOSI5foimyVAktESxYLQ0NWInw/NlTUePjX8sc01i5dDG+4Y04NIDpWNatkucxdsag7+INgT9ASDw35riGGhmGe4PfG06Mo3efnNB7+5R/T2L/73jADR3I99cbdI2fDT9FkOuanwvVTHgqGG9LKKZ3D4qLEwKKCdu66qtl7cE+zohK3sWn17tvzTloRRrtMDWUt7KJoUPJz9hrtmkMZH79/oTl/+jOtpqhc1dIhITdGxRiOsrhQ7GUKEAzoH62Y1wINlaf1Qj0tWD1wy8MbQnF7AStZv6HcykNBuUFXStCKsDbaqGEVoiwNFe3LoHekS147rAUr+5bWV4PBUFAloCFPaEVYVJaKUZiAJynz3+gtoKGRFmCVt3+V7wqqcIEV04ywqEyVuSwqCGuzSIUyNpf1T9QSgCp/f+YcXZF6mhEWladGU6zNIjnL2FzuxEl/pqsMJcq2MndYkbraERZ7TCXSwnwWy1nOfu91dzZP3HWk+bfr/r2htx/ggeJyfKd8V5AarhbAsIpZA4uMxNCQXYU9FLBToIToilqvPSRkRdXIiqEhS4o9FLBRwABWNoaul2oFLDWDcddQTUoUBAV6FVC+K0h1qAUsXYMtgaVmNKDVdRu+QwEdBSi6olGM4qZ23ffZZAksqk/NeECrz304BgXCFShpKMittAYW16OyJ2hR+IoNCkABmQJGsFILUIZaFwNYqo3AJPyQK3EcCrgpUCqsqHUxgEX1qEELQ0OSExsUCFPACFZhxgTkigUsMg3QCnAQskABLQUMYaV2bU+1NSawpmzxOo9Iy0suJK5cgTnAilwYG1iqJAa0Kr8K0XxnBQzWWjnXrZkwNrDIdkBL04MoCwpMKEDRlfJaK65R9VrmQsf2KYA1Zk/QOURaQbIhUwUKzGUoyK5KBSx1MgNa7FLsocCmAnODFbUqFbCobkCLVMAGBQwUMISVgbXuRaYEFlkJaLn7CimhgJMCxrBSv2adGnUlUWpg+djqnBbDQ2epkHBmCswZVuSqHIBlQmxAa2ZXIpozqcDcYUUC5AAssgPQIhWwQYFABWqAFUmTC7DIFkCLVMAGBTwVqAVWJEtOwCJ7AC1SARsUcFCAQEU/HHFm9VxDUyAGm8n1KLEzN2BRW0xEwpyWpJsgb24KcFR1/vRn1cCKfJAjsMguQItUwAYFehRgWBlFVT015nMoV2CRQoBWPv0ElmSiQCRYmVx7GhLmDCxqn4lwGB5qdB2UEVuB2mFFeucOLLIR0CIVsFWtAGC16f4SgEWWmkKL7rRQh8AGBXJUALBaeGXH4mP2nwha6lih4SH9o/cF7T24p1kxQWP22sLADBUgUNGL96hvGk+wF9PrS4mwuDuZCYt5LZYY+xwU4KjKcNkCN9PsmuIKNPelAYvabiYwQwtDRM0uhrJ8FWBYGUdVZJbZteTbZtf0JQ0J220iodWHh1QBdRL6hyFiW258jqFAxCEgNac4WJHRpQKLBTeBFhXO0dY111/V7Ll1F+a2SBRsZgpEjKqoDUXCigwvGVgsvCm0EG2RzNisFEBU5ads6cCi1poND1lKRFusBPaaCiCq8ldzDsCiVkeBFqIt/w6GHNsViBxVkQHFDgG76s0FWOwUs+EhC4doi5XAPkSByFEVmTgbWFFj5gQsdk4UaHG0hUl5kh3blAIJoioyaVawogbNDVjsJHNoUUUELQYXVsmTIti6CiQCFZkxO1hRo+YIrLazooGL3vqIaIukx0YKJAQVVT9LWFHD5gosahtt5Lho0OJoC+Da0L7K/wAqW7fPHVikXjRoUWXtYSLARYrUsSUGFYk826iq3YNqAFbbmVGiLaoQ4Gp3s/l+zgBUJG4VsKKG1gIsaittUaMtqhDgIhXmt2UCKhK2GlhRY2sDFjs4WqRFFdIGcG3qUPr/AFVaD9YILFKc/yoBXGn7XzG1ZwSqdv8tRj8tQ2sFFusXfYjIFXcjLjqOt0KwOvnsAap8fEGW1A4s0iBZtEWVM7joM72DC3cWSYn0W2agIkG4n6YXJ6EFANZC/GTRFpvA8GJw0XFEXayO/Z4hRTVFeI+6a4MAqpZSAFZLjPWP3Dmiz221zWBw0TGGF8DVVkjvc6aQogZyX9Rr7AxKArD6ncidJSm4yDSGF4OLjgFepEL4ljGkuFHc//g79lcUALDGuwJ1nOTQIhMZXPS5DS/6DoCRCsNbG1CUKqPhXtdogKqrSOc7gNURpOcrd6IswEX2teFF3wEwUmGxFQQoNpr7GH/HfkABAGtAmMotn/sAAAHJSURBVJ7D3KmyARfbWDvACgQUu477FH/HfkIBAGtCoJ7T3MmyAxfbOgUwTlfaULILJm5HxkM8NrG75z7UPY7vEwoAWBMCjZzmTpctuNj2LsD4eHcoycdz3RcIpj4pud/0ncOxCQUArAmBHE5zB8weXN22DIGsmw7fVRTgfqJSWK2FAFh6nucOWRy49CRAST0KcL/oOYVDvgoAWL6KTafnDgpwTWs15xTcD+bcxuhtA7DsJOcOC3DZaZxjyez3HG0r3iYAy96F3IEBLnutU9bAfk5pw+zrBrDiuZg7NMAVT3Prmtin1vWg/CsKAFjxu0K7kwNe8fXXqLHtQ43yUIajAgCWo1BGybjjA1xGAisXy/5SLhbFuSoAYLkqZZuOLwSAy1bnkNLZNyF5kUdZgZXL9LzD+nb/j3cqF43ihAoAXkIBBdkBKYF42llP/HJtq8gtYG0dWf8AeLXVyOIz4GXvBkDKXmPnGtqQamfCkLCtRr6fuxcTACb3VVdTeYkowVyBL/XVMES3vrQ4lkQButja/5IYUVilbb0Aq8Kcx+YiwmIlyt53L0BEYHgnetk9esB6AGtAmMIPdwFGzZkzxPraW7gL6zV/bIT3/5MHY60dAXyMAAAAAElFTkSuQmCC",
        id: 'navegadorcapivaramod',
        name: 'Navegador',
        color1: '#61B822',
        color2: '#5DB022',
        color3: '#468C1B',
        blocks: [
          {
            opcode: 'buscar',
            blockType: Scratch.BlockType.REPORTER,
            text: 'buscar [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              }
            }
          },
          {
            opcode: 'buscarJson',
            blockType: Scratch.BlockType.REPORTER,
            text: 'buscar json [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/data.json'
              }
            }
          },
          {
            opcode: 'buscarAvancado',
            blockType: Scratch.BlockType.REPORTER,
            text: 'buscar [URL] método [METODO] cabeçalhos [CABECALHOS] corpo [CORPO]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              },
              METODO: {
                type: Scratch.ArgumentType.STRING,
                menu: 'metodos',
                defaultValue: 'GET'
              },
              CABECALHOS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}'
              },
              CORPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'baixarDeDados',
            blockType: Scratch.BlockType.COMMAND,
            text: 'baixar arquivo [NOME] da url de dados [DADOS]',
            arguments: {
              NOME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'file.png'
              },
              DADOS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'data:,'
              }
            }
          },
          {
            opcode: 'baixarDeUrl',
            blockType: Scratch.BlockType.COMMAND,
            text: 'baixar arquivo [NOME] da url [URL]',
            arguments: {
              NOME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'file.png'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/file.png'
              }
            }
          },
          {
            opcode: 'analisarJson',
            blockType: Scratch.BlockType.REPORTER,
            text: 'analisar json [JSON]',
            arguments: {
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"a":1}'
              }
            }
          }
        ],
        menus: {
          metodos: {
            acceptReporters: true,
            items: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
          }
        }
      };
    }

    async buscar(args) {
      try {
        const resposta = await Scratch.fetch(String(args.URL));
        return await resposta.text();
      } catch (erro) {
        return '';
      }
    }

    async buscarJson(args) {
      try {
        const resposta = await Scratch.fetch(String(args.URL));
        const dados = await resposta.json();
        return converterValor(dados);
      } catch (erro) {
        return '';
      }
    }

    async buscarAvancado(args) {
      try {
        const metodo = String(args.METODO).toUpperCase();
        const opcoes = {
          method: metodo,
          headers: lerCabecalhos(String(args.CABECALHOS))
        };
        const corpo = String(args.CORPO);
        if (corpo !== '' && metodo !== 'GET' && metodo !== 'HEAD') {
          opcoes.body = corpo;
        }
        const resposta = await Scratch.fetch(String(args.URL), opcoes);
        return await resposta.text();
      } catch (erro) {
        return '';
      }
    }

    async baixarDeDados(args) {
      try {
        salvarArquivo(String(args.NOME), String(args.DADOS));
      } catch (erro) {}
    }

    async baixarDeUrl(args) {
      const url = String(args.URL);
      const nome = String(args.NOME);
      try {
        const resposta = await Scratch.fetch(url);
        const blob = await resposta.blob();
        const objeto = URL.createObjectURL(blob);
        salvarArquivo(nome, objeto);
        setTimeout(() => URL.revokeObjectURL(objeto), 10000);
      } catch (erro) {
        try {
          salvarArquivo(nome, url);
        } catch (erro2) {}
      }
    }

    analisarJson(args) {
      try {
        return converterValor(JSON.parse(String(args.JSON)));
      } catch (erro) {
        return '';
      }
    }
  }

  Scratch.extensions.register(new ExtensaoRequisicoes());
})(Scratch);