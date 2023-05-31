import "./FileBox.css";
import React, { Component } from 'react';
import { Tab, Tabs } from "react-bootstrap";
import Chart from "../components/Chart";

interface FileBoxState {
    fileList: string[];
    selectedTab: string;
    selectedFile: string;
}

class FileBox extends Component<{}, FileBoxState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            fileList: [],
            selectedTab: 'Measurements',
            selectedFile: ''
        };
    }

    async componentDidMount() {
        await this.fetchFileList(this.state.selectedTab);
    }

    async fetchFileList(tab: string) {
        let fileListData: string[] = [];

        try {
            if (tab === 'Measurements') {
                const response = await fetch("http://localhost:9000/magneto/measurements/list");
                fileListData = await response.json();
            } else if (tab === 'Calibrations') {
                const response = await fetch("http://localhost:9000/magneto/calibration/list");
                fileListData = await response.json();
            }

            this.setState({ fileList: fileListData, selectedFile: fileListData[0] });
        } catch (error) {
            console.log(error)
        }
    }

    handleTabChange(tab: string | null) {
        if (tab) {
            this.setState({ selectedTab: tab }, async () => {
                await this.fetchFileList(tab);
            });
        }
    }

    handleFileClick(file: string) {
        if (file) {
            this.setState({ selectedFile: file });
        }
    }

    render() {
        const { fileList, selectedTab, selectedFile } = this.state;

        return (
            <div className='header'>
                <h3>List of Files</h3>
                <div className="file_list">
                    {fileList.map((file, index) => (
                        <div key={index} onClick={() => this.handleFileClick(file)} className='file'>
                            {file}
                        </div>
                    ))}
                </div>
                <div>
                    <Tabs
                        defaultActiveKey="Measurements"
                        id="chart_tabs"
                        className="tabs my-2 fs-5 fw-bold"
                        activeKey={selectedTab}
                        onSelect={(tab: string | null) =>
                            this.handleTabChange(tab ? tab : '')
                        }
                    >
                        <Tab eventKey="Measurements" title="Measurements" className="tab">
                            {selectedTab === 'Measurements' && (
                                <Chart key={selectedFile} csv_filename={selectedFile} />
                            )}
                        </Tab>
                        <Tab eventKey="Calibrations" title="Calibrations" className="tab">
                            {selectedTab === 'Calibrations' && (
                                <Chart key={selectedFile} csv_filename={selectedFile} />
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default FileBox;
