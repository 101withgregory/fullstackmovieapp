import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import FilmCard from "./components/FilmCard";
import {useDebounce} from 'react-use';
import { getTrendingFilms, updateSearchCount } from "./appwright";
const API_KEY = import.meta.env.VITE_API_KEY;
const ACCESS_TOKEN=import.meta.env.VITE_ACCESS_TOKEN;
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [filmList, setFilmList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingFilms, setTrendingFilms] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // this react hook debounces the users search term to disable the user from making too many API requests
  // and it waits for a user to stop typing after 500ms 
  useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm])
//fetching the films
  const fetchMovies = async (query='') => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
     
      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found");
        setFilmList([]);
      } else {
        setFilmList(data.results);
      }
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Hard time fetching your films. Try again later.");
    } finally {
      setIsLoading(false);
    }
  }; 
// load trending films
const loadTrendingFilms = async ()=>{
   try {
    const films = await getTrendingFilms();
    setTrendingFilms(films);
   } catch (error) {
    console.log(error)
   }
}
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  useEffect(()=>{
loadTrendingFilms();
  },[])
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">movies</span> You'll Enjoy
              without the hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
   {
    trendingFilms.length > 0 && (
     <section className="trending">

      <h2>Trending Movies</h2>
      <ul>
        {trendingFilms.map((film, index)=>(
          <li key={film.id}>
            <p>{index + 1}</p>
            <img src={film.poster_url} alt={film.title} />
          </li>
        ))}
      </ul>
     </section>
    )
   }
          <section className="all-movies">
            <h2 className="mt-[40px]">All movies</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            {isLoading ? (
            <Spinner/>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {filmList.map((film) => (
                  <FilmCard key={film.id} film={film}/>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
