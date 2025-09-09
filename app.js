const API = 'http://localhost:3000/api/expenses';
let expenses = [];
let editId = null;


const expensesContainer = document.getElementById('expensesContainer');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const expenseForm = document.getElementById('expenseForm');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');



let barChart, pieChart, weekChart;


function showModal(isEdit=false){ modal.classList.remove('hidden'); modalTitle.textContent=isEdit?'Edit Expense':'Add Expense'; }
function hideModal(){ modal.classList.add('hidden'); expenseForm.reset(); editId=null; }
addBtn.onclick=()=>showModal(false);
cancelBtn.onclick=hideModal;


expenseForm.onsubmit=async e=>{
e.preventDefault();
const fd=new FormData(expenseForm);
const payload={ expense_name:fd.get('expense_name'), amount:parseFloat(fd.get('amount')), category:fd.get('category'), date_of_expense:fd.get('date_of_expense') };
if(editId){ await fetch(`${API}/${editId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }
else { await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }
hideModal();
loadExpenses();
};


async function loadExpenses(){
const res=await fetch(API);
expenses=await res.json();
renderExpenses();
updateCharts();
}


function renderExpenses(){
expensesContainer.innerHTML='';
if(!expenses.length){ expensesContainer.innerHTML='<div class="card">No expenses yet.</div>'; return; }
expenses.forEach(exp=>{
const el=document.createElement('div');
el.className='card';
el.innerHTML=`<h3>₹${exp.amount} — ${exp.expense_name}</h3><div class="meta">${exp.date_of_expense} • ${exp.category}</div><div class="actions"><button class="btn" onclick="onEdit(${exp.id})">Edit</button><button class="btn" onclick="onDelete(${exp.id})">Delete</button></div>`;
expensesContainer.appendChild(el);
});
}


window.onEdit=id=>{ const e=expenses.find(x=>x.id===id); if(!e) return; editId=id; expenseForm.expense_name.value=e.expense_name; expenseForm.amount.value=e.amount; expenseForm.category.value=e.category; expenseForm.date_of_expense.value=e.date_of_expense; showModal(true); };
window.onDelete=async id=>{ if(confirm('Delete?')){ await fetch(`${API}/${id}`,{method:'DELETE'}); loadExpenses(); }};


// Chart helpers
function getWeekKey(d){ const dt=new Date(d); const onejan=new Date(dt.getFullYear(),0,1); const week=Math.ceil((((dt-onejan)/86400000)+onejan.getDay()+1)/7); return `${dt.getFullYear()}-W${week}`; }
function getMonthKey(d){ const dt=new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`; }


function updateCharts(){
const monthTotals={}, weekTotals={}, categoryTotals={};
expenses.forEach(e=>{
const m=getMonthKey(e.date_of_expense); monthTotals[m]=(monthTotals[m]||0)+Number(e.amount);
const w=getWeekKey(e.date_of_expense); weekTotals[w]=(weekTotals[w]||0)+Number(e.amount);
categoryTotals[e.category]=(categoryTotals[e.category]||0)+Number(e.amount);
});


// stacked bar for months (per category)
const cats=Object.keys(categoryTotals);
const months=Object.keys(monthTotals).sort();
const datasets=cats.map(cat=>({label:cat,data:months.map(m=>expenses.filter(e=>getMonthKey(e.date_of_expense)===m&&e.category===cat).reduce((a,b)=>a+Number(b.amount),0))}));


if(barChart) barChart.destroy();
barChart=new Chart(document.getElementById('barChart'),{type:'bar',data:{labels:months,datasets},options:{responsive:true,plugins:{title:{display:true,text:'Month-wise (stacked)'}},scales:{x:{stacked:true},y:{stacked:true}}}});


// week chart simple bar
const weeks=Object.keys(weekTotals).sort();
const weekVals=weeks.map(w=>weekTotals[w]);
if(weekChart) weekChart.destroy();
weekChart=new Chart(document.getElementById('weekChart'),{type:'bar',data:{labels:weeks,datasets:[{label:'Week total',data:weekVals}]},options:{responsive:true}});


// pie chart
if(pieChart) pieChart.destroy();
pieChart=new Chart(document.getElementById('pieChart'),{type:'pie',data:{labels:Object.keys(categoryTotals),datasets:[{data:Object.values(categoryTotals)}]}});
}

function exportChart(chart,filename){ const a=document.createElement('a'); a.href=chart.toBase64Image(); a.download=filename; a.click(); }


loadExpenses();

const listLink = document.querySelector('a[href="#list"]');
const analysisLink = document.querySelector('a[href="#analysis"]');
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  document.querySelector(`.nav-links a[href="#${id}"]`).classList.add('active');
}
listLink.onclick = e=>{ e.preventDefault(); showPage('list'); };
analysisLink.onclick = e=>{ e.preventDefault(); showPage('analysis'); updateCharts(); };

// SEARCH filter
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', ()=>{
  const q=searchInput.value.toLowerCase();
  const cards=[...expensesContainer.getElementsByClassName('card')];
  cards.forEach(card=>{
    const text=card.innerText.toLowerCase();
    card.style.display=text.includes(q)?'':'none';
  });
});