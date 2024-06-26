import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const SearchBar = ({ problems, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedSolved, setSelectedSolved] = useState('');
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [solvedDropdownOpen, setSolvedDropdownOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const difficultyRef = useRef(null);
    const solvedRef = useRef(null);
    const filterRef = useRef(null);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setDifficultyDropdownOpen(false);
    };

    const handleSolvedChange = (solved) => {
        setSelectedSolved(solved);
        setSolvedDropdownOpen(false);
    };

    useEffect(() => {
        const filteredProblems = problems.filter(problem => {
            const matchesSearchTerm = problem.name && problem.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = selectedDifficulty === "" || problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
            const matchesSolved = selectedSolved === "" || 
                                  (selectedSolved === "SOLVED" && problem.solved) || 
                                  (selectedSolved === "UNSOLVED" && !problem.solved);
            return matchesSearchTerm && matchesDifficulty && matchesSolved;
        });
        onSearch(filteredProblems);
    }, [problems, searchTerm, selectedDifficulty, selectedSolved, onSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
                setDifficultyDropdownOpen(false);
            }
            if (solvedRef.current && !solvedRef.current.contains(event.target)) {
                setSolvedDropdownOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-center mt-6">
            <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full max-w-2xl">
                <FaSearch className="ml-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex-grow px-4 py-2 border-transparent rounded-full focus:outline-none"
                />
                <div className="flex md:hidden ml-2 relative">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="py-2 px-2 text-white bg-blue-600 rounded-md focus:outline-none"
                    >
                        <FaFilter />
                    </button>
                    {filterOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10" ref={filterRef}>
                            <div className="px-4 py-2">
                             
                                <button
                                    onClick={() => handleDifficultyChange("HARD")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    HARD
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("MEDIUM")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    MEDIUM
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("EASY")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    EASY
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    ALL Difficulty
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("SOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    SOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("UNSOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    UNSOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    SOlVED & UNSOLVED
                                </button>
                            </div>
                            
                        </div>
                    )}
                </div>
                {/* <div className={` hidden md-flex   items-center md:block`}> */}
                <div className={`md:block  md:flex hidden`}>
                    <div className="relative mx-2">
                        <button
                            onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
                            className="py-2 px-2 text-white text-xs font-medium rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "100px", whiteSpace: "nowrap" }}
                        >
                            {selectedDifficulty || "ALL"} ▼
                        </button>
                        {difficultyDropdownOpen && (
                            <div className="absolute mt-2 w-100 items-center bg-white rounded-lg shadow-lg" ref={difficultyRef}>
                                <button
                                    onClick={() => handleDifficultyChange("HARD")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    HARD
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("MEDIUM")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    MEDIUM
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("EASY")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    EASY
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    ALL
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative mx-2">
                        <button
                            onClick={() => setSolvedDropdownOpen(!solvedDropdownOpen)}
                            className="py-2 px-1 text-white text-xs font-medium rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "100px", whiteSpace: "nowrap" }}
                        >
                            {selectedSolved || "ALL"} ▼
                        </button>
                        {solvedDropdownOpen && (
                            <div className="absolute mt-2 w-100 bg-white rounded-lg shadow-lg" ref={solvedRef}>
                                <button
                                    onClick={() => handleSolvedChange("SOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    SOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("UNSOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    UNSOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 hover:bg-gray-200 text-sm"
                                >
                                    ALL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
