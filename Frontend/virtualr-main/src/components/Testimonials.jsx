import { resources } from "../constants";
import { Link } from "react-router-dom";

const Resources = () => {
  return (
    <section id="resources" className="mt-12 tracking-wide">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-6 lg:my-12 font-serif text-warm-primary">
        Helpful Resources
      </h2>

      <div className="flex flex-wrap justify-center">
        {resources.map((resource, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
            <div className="bg-warm-cardbg rounded-2xl p-6 text-md border border-warm-border shadow-md hover:shadow-lg transition">
              <p className="text-warm-soft">{resource.description}</p>

              <div className="flex mt-8 items-start">
                <img
                  className="w-12 h-12 mr-6 rounded-full border border-warm-border"
                  src={resource.image}
                  alt={resource.name}
                />
                <div>
                  <h6 className="font-semibold text-warm-primary">
                    {resource.name}
                  </h6>

                  {/* Conditional rendering based on internal/external link */}
                  {resource.link.startsWith("/") ? (
                    <Link
                      to={resource.link}
                      className="text-sm font-normal italic text-warm-soft hover:text-warm-accent transition"
                    >
                      Visit Resource →
                    </Link>
                  ) : (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-normal italic text-warm-soft hover:text-warm-accent transition"
                    >
                      Visit Resource →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Resources;
