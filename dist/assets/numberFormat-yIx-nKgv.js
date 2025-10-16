const r=e=>e==null||isNaN(e)?"0":e>=1e9?(e/1e9).toFixed(1)+"B":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toString();export{r as f};
