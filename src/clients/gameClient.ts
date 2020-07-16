const url = "http://localhost/rest";

enum PlayerStatus {
    WAIT = 'WAIT',
    JOINED = 'JOINED'
}

interface DescribeTokenResponse {
    status: PlayerStatus;
    playerId?: string;
    gameId?: string;
}

interface JoinGameResponse {
    tokenId: string;
}

interface GetQuestionRequest {
    playerId: string
    gameId: string
}

interface GetQuestionResponse {
    questionText: string;
    questionId: string;
    choices: {[id: string]: string}
}

interface GetStatisticsRequest {
    gameId: string;
    questionId: string;
}

interface GetStatisticsResponse {
    [key: string]: number
}

interface SubmitAnswerRequest {
    gameId: string;
    answerId: string;
    questionId: string;
    playerId: string;
}

type AnswerStatus = 'RIGHT' | 'WRONG';

interface SubmitAnswerResponse {
    status: AnswerStatus;
}

interface IsWinnerResponse {
    isWinner: boolean;
}

interface IsWinnerRequest {
    gameId: string;
    playerId: string;
}

export async function describeToken(tokenId: string): Promise<DescribeTokenResponse>  {
    const response: DescribeTokenResponse = await makeRequest('GET', `${url}/token?tokenId=${tokenId}`, null);

    return response;
}


export async function joinGame(playerName: string): Promise<JoinGameResponse> {
    const response: JoinGameResponse = await makeRequest('POST', `${url}/game`, {name: playerName});

    return response;
}

export async function submitAnswer(request: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    const response: SubmitAnswerResponse = await makeRequest('POST', `${url}/answers`, request);

    return response;
}

export async function getQuestion({playerId, gameId}: GetQuestionRequest): Promise<GetQuestionResponse> {
    const response: GetQuestionResponse = await makeRequest('GET', `${url}/questions?playerId=${playerId}&gameId=${gameId}`, null);

    return response;
}

export async function getStatistics({questionId, gameId}: GetStatisticsRequest): Promise<GetStatisticsResponse> {
    const response: GetStatisticsResponse = await makeRequest('GET', `${url}/stats?questionId=${questionId}&gameId=${gameId}`, null);

    return response;
}

export async function isWinner({gameId, playerId}: IsWinnerRequest): Promise<IsWinnerResponse> {
    const response: IsWinnerResponse = await makeRequest('GET', `${url}winner/?gameId=${gameId}&playerId=${playerId}`);
    
    return response;
}


type Verbs = 'GET' | 'POST' | 'PUT'

function makeRequest(method: Verbs, url: string, params: any): any {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                if (xhr.response) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(undefined);
                }
            } else {
                console.log(xhr);
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(params));
    });
}