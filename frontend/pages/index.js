import Head from 'next/head'
import { useEffect, useState } from 'react'
import { API_HOST } from '../config'
import { PieceGraph } from '../components/GraphExplorer'
import { useRouter } from 'next/router'

const MapModeToggle = ({mapMode, setMapMode}) => {
  return <label className="relative inline-flex items-center mr-5 cursor-pointer">
    <input type="checkbox" value="" className="sr-only peer" checked={mapMode} onChange={() => setMapMode(x => !x)} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
    <span className="ml-3 text-sm font-medium text-gray-600">Map mode</span>
  </label>;
}

const SearchBar = ({ setSearch }) => {
  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search"
        className="w-80 px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
      <svg
        className="absolute top-2 right-2 h-5 w-5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M13.93 12.06a8 8 0 111.414-1.414l3.293 3.293a1 1 0 01-1.414 1.414l-3.293-3.293zm-4.92 0a4.5 4.5 0 103.182 1.318l.707.707a1 1 0 11-1.414 1.414l-.707-.707A4.472 4.472 0 009.01 12.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

const SearchFilter = ({ setFilters }) => {
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [signatureKey, setSignatureKey] = useState("");

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSignatureKeyChange = (event) => {
    setSignatureKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilters({ author, year, difficulty, signatureKey });
  };

  return (
    <form className="flex flex-wrap items-center justify-center my-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={author}
        onChange={handleAuthorChange}
        placeholder="Author"
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      />
      <input
        type="text"
        value={year}
        onChange={handleYearChange}
        placeholder="Year"
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      />
      <input
        type="text"
        value={difficulty}
        onChange={handleDifficultyChange}
        placeholder="Difficulty"
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      />
      <input
        type="text"
        value={signatureKey}
        onChange={handleSignatureKeyChange}
        placeholder="Signature Key"
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 sm:mt-0"
      >
        Filter
      </button>
    </form>
  );
}

const SelectedPieceCard = ({ selectedPiece }) => {
  const router = useRouter()
  const onGoToPiece = () => {
    if (selectedPiece === null) return;
    router.push(`/pieces/${selectedPiece?.id}`)
  };
  return <div onClick={onGoToPiece} className={`border p-4 rounded-md flex ${selectedPiece === null? '': 'cursor-pointer hover:bg-zinc-50'}`}>
      <div className={`grow ${selectedPiece === null? 'text-gray-400': ''}`}>
          <div className="flex mb-1">
              <div className={`rounded-full mr-2 mt-1.5 w-4 h-4 ${selectedPiece === null? 'bg-red-300': 'bg-red-600'}`}/>
              <div className="flex flex-col">
                  <span className="font-medium text-lg ">{selectedPiece?.title ?? 'Select a piece'}</span>
                  <span className="text-md">{selectedPiece?.author ?? '...'}</span>
              </div>
          </div>
      </div>
      <div className="">
          <button className={`grow-0 rounded-md text-white font-medium p-2  ${selectedPiece === null? 'bg-gray-300 cursor-default': 'cursor-pointer  bg-black hover:bg-gray-800 '}`}>
              Learn more
          </button>
      </div>
  </div>
}

const grayscaleHex = (value) => {
  const intValue = Math.round(value * 255);
  const hexValue = intValue.toString(16).padStart(2, '0');
  return `#${hexValue}${hexValue}${hexValue}`;
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
  const range = fromMax - fromMin;
  const scaledValue = (value - fromMin) / range;
  const toRange = toMax - toMin;
  return (scaledValue * toRange) + toMin;
}

export const GraphExplorer = ({ pieces }) => {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const getPieceColor = ({piece, isHovered, isSelected }) => {
    const mappedDifficulty = 1-mapRange((piece.difficulty.x1+piece.difficulty.x2)/2, 0, 1, 0.2, 0.7);
    if (isSelected) return '#dc2626';
    if (isHovered) return grayscaleHex(mappedDifficulty-0.2);
    return grayscaleHex(mappedDifficulty);
};
  return  <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
              <SelectedPieceCard selectedPiece={selectedPiece} />
              <PieceGraph 
                pieces={pieces} 
                onSelectPiece={setSelectedPiece} 
                selectedPiece={selectedPiece}
                getPieceColor={getPieceColor}
                isPieceSelectable={() => true}
              />
          </div>
}


export default function Home() {
  const [pieces, setPieces] = useState({});
  const [mapMode, setMapMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    query: ''
  });
  const [searchFilter, setSearchFilter] = useState({
    author: '',
    name: '',
    year: '',
    difficulty: '',
    signatureKey: ''
  });

  useEffect(() => {
    fetch(`${API_HOST}/pieces`).then(r => r.json()).then(r => setPieces(r['array']))
  }, []);

  const handleSearch = (event) => {
    setSearchQuery({...searchQuery, [event.target.name]: event.target.value});
  };
  const handleFilterChange = (event) => {
    setSearchFilter({ ...searchFilter, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Head>
        <title>Can I Play It?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="min-h-screen flex flex-col w-screen h-screen overflow-hidden p-2">
        <div>
          <MapModeToggle mapMode={mapMode} setMapMode={setMapMode} />
        </div>
        <div className="flex justify-center">
          <SearchBar query={searchQuery} setQuery={handleSearch} />
        </div>
        <div className="flex justify-center">
          <SearchFilter filter={searchFilter} onFilterChange={handleFilterChange} />
        </div>
        { mapMode && <div className="flex justify-center content-center flex-1 bg-white overflow-hidden">
          <GraphExplorer pieces={pieces} searchQuery={searchQuery} searchFilter={searchFilter} /> 
          </div>}
      </main>
    </>
  )
}