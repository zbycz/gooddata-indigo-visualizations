import { getProjectId } from '../location';

describe('getProjectId', () => {
    it('returns null by default', () => {
        expect(getProjectId('')).to.be(null);
    });

    it('returns project id from URI hash', () => {
        let id = 'budtwmhq7k94vsd234dsf49j3620rzsm3u1';

        expect(getProjectId(`#/${id}/reportId/edit`)).to.be(id);
    });
});
