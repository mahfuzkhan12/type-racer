const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "To be or not to be, that is the question.",
    "In the beginning, God created the heavens and the earth.",
    "All that glitters is not gold.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
  ];
  
  let currentQuoteIndex;
  let startTime;
  let endTime;
  
  function startTest() {
    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    const quoteElement = document.getElementById("sentence");
    quoteElement.textContent = quotes[currentQuoteIndex];
    document.getElementById("input").value = "";
    document.getElementById("speed").textContent = "0";
    document.getElementById("result").style.visibility = "hidden";
    document.getElementById("input").addEventListener("input", handleInput);
    startTime = new Date();
  }
  
  function handleInput() {
    const inputText = document.getElementById("input").value;
    const quoteText = quotes[currentQuoteIndex];
    const quoteElement = document.getElementById("sentence");
  
    let displayText = '';
  
    for (let i = 0; i < quoteText.length; i++) {
      const isCorrect = inputText[i] === quoteText[i];
      const spanClass = isCorrect ? 'correct' : 'incorrect';
      displayText += `<span class="${spanClass}">${quoteText[i] || ' '}</span>`;
    }
  
    quoteElement.innerHTML = displayText;
  
    if (inputText === quoteText) {
      endTime = new Date();
      const elapsedTimeInSeconds = (endTime - startTime) / 1000;
      const wordsPerMinute = Math.round((quoteText.split(/\s+/).length / elapsedTimeInSeconds) * 60);
      document.getElementById("speed").textContent = wordsPerMinute;
      document.getElementById("result").style.visibility = "visible";
      document.getElementById("input").removeEventListener("input", handleInput);
    }
  }
  
  