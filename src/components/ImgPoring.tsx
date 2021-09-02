import PoringMinus1 from 'assets/images/poring_-1.png'
import Poring0 from 'assets/images/poring_0.png'
import Poring1 from 'assets/images/poring_1.png'


export default function ImgPoring({ state = 1 }: { state?: number }): JSX.Element {
    switch (state) {
        case 0:
            return <img src={Poring0} className="inline-block" alt="fail" />;
        case -1:
            return <img src={PoringMinus1} className="inline-block" alt="worst" />;
        default:
            return <img src={Poring1} className="inline-block" alt="good" />;
    }
}