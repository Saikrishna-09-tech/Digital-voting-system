# Quick Start - Next Session

## ⚡ Resume Work In 3 Steps

### 1️⃣ Start Servers
```bash
# Terminal 1 - Backend
cd c:\Users\HP\Desktop\programs\digital voting\backend
npm start

# Terminal 2 - Frontend  
cd c:\Users\HP\Desktop\programs\digital voting\frontend
npm run dev
```

✅ Backend on: `http://localhost:5000`
✅ Frontend on: `http://localhost:5173`

---

### 2️⃣ Login & Test
```
Admin Login:
  Email: vtu27196@veltech.edu.in
  Password: admin123

Voter Login:
  Email: voter@example.com
  Password: voter123
```

---

### 3️⃣ Test Workflow
1. **Add Candidate** → Upload image (1:1 ratio, 500×500px ideal)
2. **Edit Candidate** → Click Edit button, update details
3. **Delete Candidate** → Click Delete, confirm
4. **Start Election** → Click "Start Election"
5. **Cast Vote** → Select candidate, vote
6. **End Election** → Click "Stop Election" (results stay visible ✅)
7. **View Results** → See votes & percentages
8. **Start New Election** → Click "Start Election" again (votes cleared, can revote)

---

## 📋 What Was Done Today

- ✅ Candidate image upload/edit/delete
- ✅ Vote preservation when election ends
- ✅ Admin account creation
- ✅ Blockchain smart contract improvements
- ✅ All UI buttons working

---

## 🔄 Outstanding Items

- Deploy smart contract to Sepolia testnet
- Update `.env` with CONTRACT_ADDRESS

---

## 📞 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Database Connection Error?
- Ensure MongoDB is running locally
- Check: `mongodb://localhost:27017/votingDB`

### Votes Not Showing After Stop?
- Refresh browser (F5)
- Check backend console for errors
- Ensure backend is running latest code

---

**Session saved!** Ready to continue whenever you're back.

