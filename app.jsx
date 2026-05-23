// App entrypoint — assembles the design canvas with three directions.

function App() {
  return (
    <DesignCanvas>
      <DCSection id="scrapbook"
        title="01 · Scrapbook"
        subtitle="Taped polaroids, washi tape, handwritten — 스크랩북. Warmest, most personal.">
        <DCArtboard id="sb-cover"  label="A · Cover"       width={1200} height={820}><ScrapbookCover  /></DCArtboard>
        <DCArtboard id="sb-photos" label="B · Photo Wall"  width={1200} height={820}><ScrapbookPhotos /></DCArtboard>
        <DCArtboard id="sb-food"   label="C · Food Diary"  width={1200} height={820}><ScrapbookFood   /></DCArtboard>
      </DCSection>

      <DCSection id="riso"
        title="02 · Riso Zine"
        subtitle="Big hangul, halftone, two-color print — 리소. Loudest, most graphic.">
        <DCArtboard id="rs-cover"  label="A · Cover"       width={1200} height={820}><RisoCover  /></DCArtboard>
        <DCArtboard id="rs-photos" label="B · Contact Sheet" width={1200} height={820}><RisoPhotos /></DCArtboard>
        <DCArtboard id="rs-food"   label="C · Food"         width={1200} height={820}><RisoFood   /></DCArtboard>
      </DCSection>

      <DCSection id="cafe"
        title="03 · Café Journal"
        subtitle="Editorial photo book, gum-leaf sage + persimmon — 카페. Quietest, most considered.">
        <DCArtboard id="cf-cover"  label="A · Cover"       width={1200} height={820}><CafeCover  /></DCArtboard>
        <DCArtboard id="cf-photos" label="B · Plates"      width={1200} height={820}><CafePhotos /></DCArtboard>
        <DCArtboard id="cf-food"   label="C · Food"        width={1200} height={820}><CafeFood   /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
