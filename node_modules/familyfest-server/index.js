import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app=express();
const PORT=process.env.PORT||4000;
app.use(cors());
app.use(express.json());

const mealDbBase="https://www.themealdb.com/api/json/v1/1";

app.get("/api/health",(req,res)=>res.json({ok:true,service:"FamilyFest API"}));

app.get("/api/recipes",async(req,res)=>{
  const q=(req.query.q||"").trim();
  if(!q)return res.json({meals:[]});
  try{
    const r=await fetch(`${mealDbBase}/search.php?s=${encodeURIComponent(q)}`);
    if(!r.ok)throw new Error("Recipe provider error");
    const data=await r.json();
    res.json(data);
  }catch(err){
    res.status(502).json({error:"Recipe search unavailable",details:err.message});
  }
});

app.get("/api/google-search",async(req,res)=>{
  const q=(req.query.q||"").trim();
  if(!q)return res.status(400).json({error:"Missing q"});
  const key=process.env.GOOGLE_API_KEY;
  const cx=process.env.GOOGLE_CX;
  if(!key||!cx){
    return res.status(503).json({
      configured:false,
      error:"Google search is not configured. Add GOOGLE_API_KEY and GOOGLE_CX to server/.env."
    });
  }
  try{
    const url=new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key",key);
    url.searchParams.set("cx",cx);
    url.searchParams.set("q",q);
    url.searchParams.set("num","10");
    const r=await fetch(url);
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json(data);
    res.json({
      configured:true,
      items:(data.items||[]).map(x=>({
        title:x.title,
        link:x.link,
        snippet:x.snippet,
        image:x.pagemap?.cse_image?.[0]?.src||null
      }))
    });
  }catch(err){
    res.status(502).json({error:"Google search failed",details:err.message});
  }
});

app.listen(PORT,()=>console.log(`FamilyFest API running on http://localhost:${PORT}`));
