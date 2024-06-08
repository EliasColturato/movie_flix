import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';

export default function Home() {
  const [movieList, setMovieList] = useState([]);
  const [movieImage, setMovieImage] = useState({});

  //movie details useEffect
  useEffect(() => {
    // Opções para a requisição, incluindo o token de autenticação
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGE2ODY3ODBkNWFhODA2MDEyYzAyYTE1NTA3N2VlNyIsInN1YiI6IjYyZDFhZTBmN2UzNDgzMDA1NjY2NzEyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Zm7PD_NrGSrz_Yxni7P2YmFiaHD3f41CXwpSn59yrSk',
      },
    };

    // Busca a lista de filmes populares
    fetch(
      'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
      options
    )
      .then(response => response.json())
      .then(response => {
        // Define a lista de filmes populares no estado
        setMovieList(response.results);
        // Para cada filme, busca suas imagens
        response.results.forEach(movie => {
          fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/images`,
            options
          )
            .then(response => response.json())
            .then(response => {
              // Salva a primeira imagem de fundo (backdrop) do filme no estado
              setMovieImage(prevState => ({
                ...prevState,
                [movie.id]:
                  response.backdrops && response.backdrops.length > 0
                    ? response.backdrops[0].file_path
                    : null,
              }));
            })
            .catch(err => console.error(err));
        });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* <Header /> */}
      <h1>Home Page</h1>
      {/* Mapeia cada filme da lista e renderiza suas informações */}
      {movieList.map(movie => (
        <div key={movie.id}>
          <p>{movie.title}</p>
          <p>{movie.overview}</p>
          {/* Renderiza a imagem do filme se estiver disponível */}
          {movieImage[movie.id] && (
            <img
              src={`https://image.tmdb.org/t/p/original/${
                movieImage[movie.id]
              }`}
              alt={movie.title}
              style={{ width: '500px' }}
            />
          )}
        </div>
      ))}
    </>
  );
}
