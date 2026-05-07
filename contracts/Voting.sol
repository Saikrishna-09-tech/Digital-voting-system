// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    enum ElectionStatus {
        NOT_STARTED,
        ACTIVE,
        ENDED
    }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        string image;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => uint256) public votes;
    mapping(address => uint256) public voterRound;
    
    uint256 public candidateCount;
    ElectionStatus public electionStatus;
    address public admin;
    uint256 public totalVotes;
    uint256 public electionRound;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCasted(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted();
    event ElectionEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier electionActive() {
        require(electionStatus == ElectionStatus.ACTIVE, "Election is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionStatus = ElectionStatus.NOT_STARTED;
        candidateCount = 0;
        electionRound = 1;
    }

    function addCandidate(string memory _name, string memory _party, string memory _image) public onlyAdmin {
        require(electionStatus == ElectionStatus.NOT_STARTED, "Cannot add candidates after election starts");
        
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            party: _party,
            image: _image
        });
        
        emit CandidateAdded(candidateCount, _name);
        candidateCount++;
    }

    function startElection() public onlyAdmin {
        require(electionStatus != ElectionStatus.ACTIVE, "Election already started");

        if (electionStatus == ElectionStatus.ENDED) {
            // reset vote tracking for next election round
            electionRound++;
            totalVotes = 0;
        }

        electionStatus = ElectionStatus.ACTIVE;
        emit ElectionStarted();
    }

    function endElection() public onlyAdmin {
        require(electionStatus == ElectionStatus.ACTIVE, "Election not active");

        electionStatus = ElectionStatus.ENDED;
        emit ElectionEnded();
    }

    function vote(uint256 _candidateId) public electionActive {
        require(voterRound[msg.sender] < electionRound, "You have already voted in this election");
        require(_candidateId < candidateCount, "Invalid candidate");

        voterRound[msg.sender] = electionRound;
        votes[msg.sender] = _candidateId;
        totalVotes++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    function getVotes(uint256 _candidateId) public view returns (uint256) {
        uint256 count = 0;
        // Note: In production, use a proper vote counting mechanism
        return count;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            result[i] = candidates[i];
        }
        return result;
    }

    function getElectionStatus() public view returns (uint256) {
        return uint256(electionStatus);
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voterRound[_voter] == electionRound;
    }
}
