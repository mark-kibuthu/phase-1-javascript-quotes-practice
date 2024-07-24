document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
   
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quoteList.innerHTML = '';
          quotes.forEach(quote => {
            renderQuote(quote);
          });
        })
        .catch(error => {
          console.error('Error fetching quotes:', error);
        });
    }
  
    function renderQuote(quote) {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'quote-card');
      li.dataset.id = quote.id;
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class="btn btn-success like-btn" data-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
          <button class="btn btn-danger delete-btn" data-id="${quote.id}">Delete</button>
        </blockquote>
      `;
      quoteList.appendChild(li);
    }
  
    
    fetchQuotes();
  
    
    newQuoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const quoteInput = document.getElementById('new-quote');
      const authorInput = document.getElementById('author');
  
      
      if (quoteInput.value.trim() === '' || authorInput.value.trim() === '') {
        alert('Please enter both a quote and an author.');
        return;
      }
  
      const newQuote = {
        quote: quoteInput.value.trim(),
        author: authorInput.value.trim()
      };
  
    
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add quote');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          quoteInput.value = ''; 
          authorInput.value = '';
          renderQuote(data); 
        })
        .catch(error => {
          console.error('Error adding new quote:', error);
          alert('An error occurred while adding the quote.');
        });
    });
  
    quoteList.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-btn')) {
        const quoteId = event.target.dataset.id;
  
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (response.ok) {
              console.log('Quote deleted successfully');
              const quoteToRemove = document.querySelector(`li[data-id="${quoteId}"]`);
              if (quoteToRemove) {
                quoteToRemove.remove(); 
              }
            } else {
              throw new Error('Failed to delete quote');
            }
          })
          .catch(error => {
            console.error('Error deleting quote:', error);
            alert('An error occurred while deleting the quote.');
          });
      }
  
      if (event.target.classList.contains('like-btn')) {
        const likeBtn = event.target;
        const quoteId = likeBtn.dataset.id;
  
        fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quoteId: parseInt(quoteId) }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to add like');
            }
            return response.json();
          })
          .then(data => {
            console.log('Like added successfully:', data);
            
            const likeSpan = likeBtn.querySelector('span');
            likeSpan.textContent = data.length; 
          })
          .catch(error => {
            console.error('Error adding like:', error);
            alert('An error occurred while adding the like.');
          });
      }
    });
  
  });
  