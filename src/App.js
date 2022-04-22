//import logo from './logo.svg';
import './App.css';
//import { NavLink, Routes, Route } from 'react-router-dom';
import { useState, React, useEffect } from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

var salesmen = {
    'Kevin': 'Kevin Greene (607) 214-2080',
    'Woodson': 'Woodson McCoy (315) 360-8075',
    'Rick': 'Rick Ozer (240) 398-0954',
    'Mo': 'Mehmet Abedh (607) 376-7540'
}

var formVersions = {
    'metal-tearoff': [
        'Install tarp on perimeter as needed to protect property and landscaping',
        'Tear off existing roof all the way to roof deck',
        'Replace deteriorated plywood',
        'Replace deteriorated planks',
        'Install ice and water shield',
        'Install synthetic felt paper',
        'Install .29 gauge metal',
        'Install .26 gauge metal',
        'Install drip edge',
        'Install rake edge metal over trim',
        'Install roof ridge cap',
        'Install sidewall flashing',
        'Install apron/end wall flashing',
        'Install valley flashing',
        'Install pipe collar flashing',
        'Install flue stack flashing',
        'Install upper gambrel flashing transition',
        'Install lower gambrel flashing transition',
        'Install flashing around chimney',
        'Install flashing around skylights',
        'Magnet sweep perimeter of house',
        'Remove all trash and debris from the site',
        '40 Year Manufacturer\'s Warranty',
        '40 Year Workmanship Warranty'
    ],
    'metal-layover': [
        'Install tarp on perimeter as needed to protect property and landscaping',
        'Install 1x3 purlings 18 inches on center',
        'Install drip edge',
        'Install .29 gauge metal',
        'Install .26 gauge metal',
        'Install rake edge metal over trim',
        'Install roof ridge cap',
        'Install caps on roof hips',
        'Install sidewall flashing',
        'Install apron/end wall flashing',
        'Install valley flashing',
        'Install pipe collar flashing',
        'Install flue stack flashing',
        'Install upper gambrel flashing transition',
        'Install lower gambrel flashing transition',
        'Install flashing around chimney',
        'Install flashing around skylights',
        'Magnet sweep perimeter of house',
        'Remove all trash and debris from the site',
        '40 Year Manufacturer\'s Warranty',
        '40 Year Workmanship Warranty'
    ],
    'shingle-tearoff': [
        'Install tarp on perimeter as needed to protect property and landscaping',
        'Tear off existing roof all the way to sheathing',
        'Replace deteriorated plywood',
        'Replace deteriorated planks',
        'Install ice and water shield',
        'Install synthetic felt paper',
        'Install Lifetime architectural dimensional Owens Corning Duration shingles',
        'Install drip edge',
        'Install rake edge metal over trim',
        'Install California valleys on roof',
        'Install roof ridge vent for attic ventilation',
        'Install matching shingle caps on ridge vent',
        'Install caps on hips',
        'Install apron flashing on walls',
        'Install side wall flashing',
        'Replace all pipe collars',
        'Replace step flashing and counter flashing around chimney',
        'Magnet sweep perimeter of house',
        'Remove all trash and debris from the site',
        '50 Year Manufacturer\'s Warranty',
        '50 Year Workmanship Warranty'
    ],
    'shingle-layover': [
        'Install tarp on perimeter as needed to protect property and landscaping',
        'Install Lifetime architectural dimensional Owens Corning Duration shingles',
        'Install drip edge',
        'Install rake edge metal over trim',
        'Install California valleys on roof',
        'Install roof ridge vent for attic ventilation',
        'Install matching shingle caps on ridge vent',
        'Install caps on hips',
        'Install apron flashing on walls',
        'Install side wall flashing',
        'Replace all pipe collars',
        'Replace step flashing and counter flashing around chimney',
        'Magnet sweep perimeter of house',
        'Remove all trash and debris from the site',
        '50 Year Manufacturer\'s Warranty',
        '50 Year Workmanship Warranty'
    ]
}

function App() {
    const [formList, setFormList] = useState(formVersions['metal-tearoff']);
    const [selectedVersion, setSelectedVersion] = useState('metal-tearoff');
    const [clientName, setClientName] = useState('');
    const [clientStreet, setClientStreet] = useState('');
    const [clientCity, setClientCity] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [proposalTotal, setProposalTotal] = useState('');
    const [showOptional, setShowOptional] = useState(0);
    const [optionalItems, setOptionalItems] = useState('');
    const [salesmanInfo, setSalesmanInfo] = useState(salesmen['Kevin']);
    const [lineItems, setLineItems] = useState(formVersions['metal-tearoff']);
    const [showDiscounts, setShowDiscounts] = useState(0);
    const [discounts, setDiscounts] = useState('');
    const [customLineItems, setCustomLineItems] = useState('');
    const [resultSelectorProposal, setResultSelectorProposal] = useState(1);
    const [resultSelectorSlideshow, setResultSelectorSlideshow] = useState(0);
    const [resultSelectorFrontPage, setResultSelectorFrontPage] = useState(0);
    const [resultSelectorCollage, setResultSelectorCollage] = useState(0);
    const [selectedResultsArray, setSelectedResultsArray] = useState(['Proposal'])
    const [frontPageImage, setFrontPageImage] = useState('');
    const [collageImageA, setCollageImageA] = useState('');
    const [collageImageB, setCollageImageB] = useState('');
    const [collageImageC, setCollageImageC] = useState('');
    const [collageImageD, setCollageImageD] = useState('');
    const [collageImageAFactor, setCollageImageAFactor] = useState('1');
    const [collageImageBFactor, setCollageImageBFactor] = useState('1');
    const [collageImageCFactor, setCollageImageCFactor] = useState('1');
    const [collageImageDFactor, setCollageImageDFactor] = useState('1');
    const [description, setDescription] = useState('');
    const [collageHeight, setCollageHeight] = useState('6');
    useEffect(() => {
        var tempArray = [];
        if (resultSelectorProposal) {
            tempArray.push('Proposal')
        }
        if (resultSelectorSlideshow) {
            tempArray.push('Slideshow')
        }
        if (resultSelectorFrontPage) {
            tempArray.push('Front Page')
        }
        if (resultSelectorCollage) {
            tempArray.push('Collage')
        }
        setSelectedResultsArray(tempArray)
    }, [resultSelectorProposal, resultSelectorSlideshow, resultSelectorFrontPage, resultSelectorCollage])
    useEffect(() => {
        if (document.getElementById('outputFrontPageImage') !== null) {
            document.getElementById('outputFrontPageImage').src = frontPageImage;
        }
    }, [frontPageImage])

    var outputs = {
        proposal: <></>,
        slideshow: <></>,
        frontPage: <></>,
        collage: <></>
    };
    outputs.proposal = 
    <div className="output">
        <div id='outputHeader'>
            <div id='outputHeaderLeft'>
                <img className='logoProposal' alt='Premier Roofing Logo' src='logo.png'></img><br />
                <div id='outputClientInfo'>
                    {clientName}<br />
                    {clientStreet}<br />
                    {clientCity}<br />
                    {clientPhone}
                </div>
            </div>
            <div id='outputHeaderRight'>
                <div className='verticalAlignmentHelper'>
                    <h2>PROPOSAL</h2>
                    85 Main St<br />
                    Sidney, NY 13838<br />
                    (607) 563-9099<br />
                    info@roof007.com<br />
                    {salesmanInfo}
                </div>
            </div>
        </div>
        <div className="outputTable">
            <div className='outputTableHeader'>
                Description: {description}
            </div>
            <div className='outputTableBody'>
                <div className='outputTableLeft'>
                    {lineItems.map(val => {
                        return <>{val} <br /></>
                    })}
                    <div className='outputCustomLineItemsDiv'>
                        {customLineItems}
                    </div>
                </div>
                <div className='outputTableRightWrap'>
                    { showOptional ?
                        <div className='outputTableRight outputTableOptional'>
                            <div className='outputOptionalItemsTopText'>
                            Optional items: <br />
                            {optionalItems}
                            </div>
                            <div className='outputOptionalItemsBottomText'>
                                Not included in total.
                            </div>
                        </div> : null
                    }
                    { showDiscounts ?
                        <div className='outputTableRight outputTableDiscounts'>
                            Discounts: <br />
                            {discounts}
                        </div> : null
                    }
                </div>
            </div>
            <hr/ >
            <div className='outputTableTotalDiv'>
                <h2>Proposed total: ${proposalTotal}</h2>
                Please sign and return this proposal along with ${Math.floor(proposalTotal.replace(',','')/3)} (1/3 of the amount above).
            </div>
        </div>
        <div className='outputBottomText'>
            Roof estimates do NOT include price for deteriorated plywood or deteriorated plank boards if price is listed in description. <br /><br />
            Final payment in full is due immediately upon completion of work as described and agreed upon in this proposal. Any accounts not paid immediately
are subject to a 5% per month late fee. The credit or debit card on file will be charged upon completion of work unless otherwise specified. All
material is guaranteed to be as specified. All work is to be completed in a professional manner according to standard practices. Any alteration or
deviation from above specifications involving extra costs will be executed only upon agreement from the undersigned and will become an extra
charge over and above the estimate. All agreements are contingent upon strikes, accidents or delays out of our control. This proposal is subject to
acceptance within thirty days (30) days and is void afterward. You, the buyer may cancel this transaction at any time prior to midnight of the third
business day after this transaction. We, the company may cancel this transaction anytime up to 30 days after this agreement.<br />
            <h3>Authorized Signature __________________________________________</h3>
            The above prices, specifications and conditions are hereby accepted. You are authorized to do the work as specified. Payment will be made as
outlined above.<br />
            <h3>Name __________________________________________________ Signature ________________________________________ Date _________________</h3>
        </div>
    </div>;

    outputs.frontPage = 
    <div className='output'>
    <div className='imageAlignmentHelperOuter'>
        <img className='logoFrontPage' alt='Premier Roofing Logo' src='logo.png'></img>
        <div className='outputFrontPageContact'>
            85 Main St, Suite 3<br />
            Sidney, NY 13838<br />
            (607) 563-9099<br />
            info@roof007.com
        </div>
        <div className='outputFrontPageSubheadDiv'>
            <div className='outputFrontPageSubheadLeft'>
                <h2>Proposal prepared for:</h2>
                {clientName}<br />
                {clientStreet}<br />
                {clientCity}<br />
                {clientPhone}
            </div>
            <div className='outputFrontPageSubheadRight'>
                <h2>Estimator:</h2>
                {salesmanInfo}
            </div>
        </div>
            <div className='imageAlignmentHelper'>
                <img src={frontPageImage} id='outputFrontPageImage' />
            </div>
        </div>
    </div>

    outputs.collage = <div className='output'>
        <div className='outputCollageHeader'>
            <h1>Property Information</h1>
            Our findings about the condition of the house are detailed on the following pages.
        </div>
        <div className='outputCollageContainer' style={{'height':collageHeight + 'in'}}>
            <div className='outputCollageUpper'>
                <div className='outputCollageImageADiv' style={{'flex': collageImageAFactor}}>
                    <img src={collageImageA} className='outputCollageImageA' />
                </div>
                <div style={{'background-image': 'url(' + collageImageB + ')', 'flex': collageImageBFactor}} className='outputCollageImageB' />
            </div>
            <div className='outputCollageBottom'>
                <div style={{'background-image': 'url(' + collageImageC + ')', 'flex': collageImageCFactor}} className='outputCollageImageC' />
                <div style={{'background-image': 'url(' + collageImageD + ')', 'flex': collageImageDFactor}} className='outputCollageImageD' />
            </div>
        </div>
    </div>
    
    function setUpImageChangeEvent(evt, func) {
        var tgt = evt.target
        var files = tgt.files;

        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                func(fr.result);
                //set flex factor for image A in collage
                if (func === setCollageImageA) {
                    let im = new Image;
                    im.src = fr.result;
                    im.onload = () => {
                        setCollageImageAFactor(im.width / im.height);
                    }
                }
                if (func === setCollageImageB) {
                    let im = new Image;
                    im.src = fr.result;
                    im.onload = () => {
                        setCollageImageBFactor(im.width / im.height);
                    }
                }
                if (func === setCollageImageC) {
                    let im = new Image;
                    im.src = fr.result;
                    im.onload = () => {
                        setCollageImageCFactor(im.width / im.height);
                    }
                }
                if (func === setCollageImageD) {
                    let im = new Image;
                    im.src = fr.result;
                    im.onload = () => {
                        setCollageImageDFactor(im.width / im.height);
                    }
                }
            }
            fr.readAsDataURL(files[0]);
        }
    }

    var outputArray = [];
    function renderOutput() {
        outputArray = [];
        if (selectedResultsArray.includes('Proposal')) {outputArray.push(outputs.proposal)}
        if (selectedResultsArray.includes('Front Page')) {outputArray.push(outputs.frontPage)}
        if (selectedResultsArray.includes('Collage')) {outputArray.push(outputs.collage)}
        return outputArray;
    }

    async function radioButtonClick(id) {
        //console.log(id);
        await setFormList(formVersions[id]);
        await setSelectedVersion(id);
        updateLineItems();
    }
    
    //text input event listeners
    window.onload = function () {
        var fields = [];
        fields[0] = document.getElementById("clientName");
        fields[0].addEventListener("input", function () {
            setClientName(fields[0].value)
        });
        fields[1] = document.getElementById("clientStreet");
        fields[1].addEventListener("input", function () {
            setClientStreet(fields[1].value)
        });
        fields[2] = document.getElementById("clientPhone");
        fields[2].addEventListener("input", function () {
            setClientPhone(fields[2].value)
        });
        fields[3] = document.getElementById("proposalTotal");
        fields[3].addEventListener("input", function () {
            setProposalTotal(fields[3].value)
        });
        fields[4] = document.getElementById("optionalItems");
        fields[4].addEventListener("input", function () {
            if (fields[4].value !== '') {
                setShowOptional(1)
            } else {
                setShowOptional(0)
            }
            setOptionalItems(fields[4].value)
        });
        fields[5] = document.getElementById("salesman");
        fields[5].addEventListener("input", function () {
            setSalesmanInfo(salesmen[fields[5].value])
        });
        fields[6] = document.getElementById("discounts");
        fields[6].addEventListener("input", function () {
            if (fields[6].value !== '') {
                setShowDiscounts(1)
            } else {
                setShowDiscounts(0)
            }
            setDiscounts(fields[6].value)
        });
        fields[7] = document.getElementById("clientCity");
        fields[7].addEventListener("input", function () {
            setClientCity(fields[7].value)
        });
        fields[8] = document.getElementById("description");
        fields[8].addEventListener("input", function () {
            setDescription(fields[8].value)
        });
        fields[9] = document.getElementById("collageHeight");
        fields[9].addEventListener("input", function () {
            setCollageHeight(fields[9].value)
        });
        fields[10] = document.getElementById("customLineItems");
        fields[10].addEventListener("input", function () {
            setCustomLineItems(fields[10].value)
        });
    };

    function updateLineItems() {
        var tempLineItems = [];
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
        for (var i = 0; i < checkboxes.length; i += 1) {
            tempLineItems.push(checkboxes[i].name)
        }
        setLineItems(tempLineItems)
    }

    //output stuff
    function pdfGenerate() {
        //set outputs to appropriate y position
        var allOutputs = document.getElementsByClassName('output');
        for (var i = 0; i < allOutputs.length; i++) {
            allOutputs[i].style.top = 11*i + 'in'
        }
        setTimeout(() => {
            for (var i = 0; i < allOutputs.length; i++) {
                allOutputs[i].style.removeProperty('top');
            }
        }, 100)
        //set overall document height
        document.body.style.height = (11 * allOutputs.length) + 'in';
        setTimeout(() => {
            document.body.style.height = '0';
        }, 100)
        console.log(document.body.scrollHeight)
        console.log((11 * allOutputs.length) * 96)
        window.print()
    }

    function resultSelectToggle(button) {
        if (button === 'Proposal') {
            setResultSelectorProposal(!resultSelectorProposal);
        }
        if (button === 'Slideshow') {
            setResultSelectorSlideshow(!resultSelectorSlideshow);
        }
        if (button === 'Front Page') {
            setResultSelectorFrontPage(!resultSelectorFrontPage);
        }
        if (button === 'Collage') {
            setResultSelectorCollage(!resultSelectorCollage);
        }
    }

    return (
        <div id="main-div">
            <div className="notOutput">
                <div className='centralInvisible'>&nbsp;</div>
                <div className='centralInvisible resultSelectorDiv'>
                    <div className={resultSelectorProposal ? 'resultSelectorButton selectedButton' : 'resultSelectorButton'} onClick={() => {resultSelectToggle('Proposal')}}>
                        <h1>Proposal {resultSelectorProposal ? '☑' : '☐'}</h1>
                    </div>
                    &nbsp;&nbsp;
                    <div className={resultSelectorSlideshow ? 'resultSelectorButton selectedButton' : 'resultSelectorButton'} onClick={() => {resultSelectToggle('Slideshow')}}>
                        <h1>Slideshow {resultSelectorSlideshow ? '☑' : '☐'}</h1>
                    </div>
                    &nbsp;&nbsp;
                    <div className={resultSelectorFrontPage ? 'resultSelectorButton selectedButton' : 'resultSelectorButton'} onClick={() => {resultSelectToggle('Front Page')}}>
                        <h1>Front Page {resultSelectorFrontPage ? '☑' : '☐'}</h1>
                    </div>
                    &nbsp;&nbsp;
                    <div className={resultSelectorCollage ? 'resultSelectorButton selectedButton' : 'resultSelectorButton'} onClick={() => {resultSelectToggle('Collage')}}>
                        <h1>Collage {resultSelectorCollage ? '☑' : '☐'}</h1>
                    </div>
                </div>
                <form>
                    <div className="centralColumnDiv">
                        <h1>Basic Info</h1>
                        <div className='inputLabelDiv'>
                            Client Name<br />
                            <input id="clientName" type="text" />
                        </div>
                        <div className='inputLabelDiv'>
                            Client Address Line 1<br />
                            <input id="clientStreet" type="text" />
                        </div>
                        <div className='inputLabelDiv'>
                            Client Address Line 2<br />
                            <input id="clientCity" type="text" />
                        </div><br /><br />
                        <div className='inputLabelDiv'>
                            Client Phone<br />
                            <input id="clientPhone" type="text" />
                        </div>
                        <div className="inputLabelDiv">
                            Estimator<br />
                            <select id='salesman'>
                                <option value="Kevin">Kevin</option>
                                <option value="Woodson">Woodson</option>
                                <option value="Rick">Rick</option>
                                <option value="Mo">Mo</option>
                            </select>
                        </div>
                    </div>
                    <div className={resultSelectorProposal ? 'centralColumnDiv' : 'centralColumnDiv hidden'}>
                        <h1>Proposal Details</h1>
                        <div className='inputLabelDiv'>
                            Description of Work<br />
                            <input id='description' type='text' />
                        </div>
                        <div className='inputLabelDiv'>
                            Proposal Total<br />
                            <input id='proposalTotal' type='text' />
                        </div>
                        <br /><br/>
                        <div className='inputLabelDiv'>
                            Optional Items<br />
                            <textarea id='optionalItems' type='text' />
                        </div>&nbsp;&nbsp;&nbsp;
                        <div className='inputLabelDiv'>
                            Discounts<br />
                            <textarea id='discounts' type='text' />
                        </div>&nbsp;&nbsp;&nbsp;
                        <div className='inputLabelDiv'>
                            Custom Line Items<br />
                            <textarea id='customLineItems' type='text' />
                        </div>
                    </div>
                    {resultSelectorFrontPage ?
                    <div className='centralColumnDiv'>
                        <h1>Front Page Image</h1>
                        <div className="inputLabelDiv">
                            <input type="file" id='frontPageImageInput' onChange={(evt) => {setUpImageChangeEvent(evt, setFrontPageImage)}} />
                        </div>
                    </div> : null
                    }
                    <div className={resultSelectorCollage ? "centralColumnDiv" : "centralColumnDiv hidden"}>
                        <h1>Collage Images</h1>
                        <i>Requires 4 images. Layout of inputs below corresponds to layout of images in collage.</i><br /><br />
                        <input type="file" className='collageImageInputA' onChange={(evt) => {setUpImageChangeEvent(evt, setCollageImageA)}} />
                        <input type="file" className='collageImageInputB' onChange={(evt) => {setUpImageChangeEvent(evt, setCollageImageB)}} />
                        <input type="file" className='collageImageInputC' onChange={(evt) => {setUpImageChangeEvent(evt, setCollageImageC)}} />
                        <input type="file" className='collageImageInputD' onChange={(evt) => {setUpImageChangeEvent(evt, setCollageImageD)}} />
                        <br /><br />
                        <div className='inputLabelDiv'> 
                            Collage height (optional)<br />
                            <input type='text' id='collageHeight' />
                        </div>
                        <br /><i>Units are inches, default is 6. Reduce this if the bottom images are being cropped severely.</i>
                    </div>
                    <div className={resultSelectorProposal ? "centralColumnDiv" : "centralColumnDiv hidden"}>
                        <h1>
                            Line Items
                        </h1>
                        <input type="radio" name="roof-type" id="metal-tearoff" onClick={() => { radioButtonClick('metal-tearoff') }} defaultChecked />
                        <label htmlFor="always">Metal Tearoff</label>

                        <input type="radio" name="roof-type" id="metal-layover" onClick={() => { radioButtonClick('metal-layover') }} />
                        <label htmlFor="never">Metal Layover</label>

                        <input type="radio" name="roof-type" id="shingle-tearoff" onClick={() => { radioButtonClick('shingle-tearoff') }} />
                        <label htmlFor="change">Shingle Tearoff</label>

                        <input type="radio" name="roof-type" id="shingle-layover" onClick={() => { radioButtonClick('shingle-layover') }} />
                        <label htmlFor="change">Shingle Layover</label><br /><br />
                        {formList.map(val =>
                            <div key={val}>
                                <input type="checkbox" name={val} id={val} className="checkbox" onClick={updateLineItems} defaultChecked />
                                <label htmlFor={val}>{val}</label>
                            </div>
                        )}
                    </div>
                    <div className="centralColumnDiv">
                        <input type="button" name="submit" value="Save/Print" id="submit-button" onClick={pdfGenerate} />
                        &nbsp;&nbsp;(opens print window)
                    </div>
                </form>
                <div className='centralInvisible' id='justTheWordPreview'><br /><br />Preview</div>
            </div>
            {renderOutput()}
                <div className='centralInvisible' id='listOfResults'><br /><br />Selected: {selectedResultsArray.join(', ')}</div>
            <div className='centralInvisible'><br /><br /></div>
        </div>
    );
}

export default App;
