import {Helmet} from "react-helmet";
import React from "react";
const Spine = props => (
    <div className="application">
                <Helmet>
                  <script src="../spine.js" type="text/javascript" />
                </Helmet>
                <h1>hi spine testing </h1>
            </div>
      
    );
export default Spine;