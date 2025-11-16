const HeroSection = () => {
  return (
    <section className="bg-warm-primary py-24 md:py-28 font-sans relative overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 relative z-10">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-warm-accent leading-tight">
            Supporting Your Journey into Motherhood
          </h1>
          <p className="mt-4 text-lg text-warm-accent/90 max-w-lg mx-auto md:mx-0">
           Ask, learn, and feel supported—anytime, anywhere.
          </p>
  
           <button
  onClick={() => {
    document.getElementById("workflow").scrollIntoView({ behavior: "smooth" });
  }}
  className="bg-[#F8DCA7] border border-[#4B1D3F] text-[#4B1D3F] py-2 px-5 rounded-full shadow-md hover:bg-[#4B1D3F] hover:text-[#F7E0B2] transition font-serif"
>
  Let’s Talk
</button>

          
        </div>
      </div>

      {/* Image stuck to bottom right */}
      <div className="absolute bottom-0 right-10 translate-x-[-40px] w-48 md:w-64 lg:w-72 rounded-t-[50%] overflow-hidden">
        <img
          src="/src/assets/heroimage.jpg"
          alt="Mother holding baby"
          className="w-full block"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;

