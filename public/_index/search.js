function _typeof(obj){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}(function(global,factory){(typeof exports==="undefined"?"undefined":_typeof(exports))==="object"&&typeof module!=="undefined"?factory(exports):typeof define==="function"&&define.amd?define(["exports"],factory):(global=global||self,factory(global.JsSearch={}))})(this,function(exports){"use strict";var AllSubstringsIndexStrategy=function(){function AllSubstringsIndexStrategy(){}var _proto=AllSubstringsIndexStrategy.prototype;_proto.expandToken=function expandToken(token){var expandedTokens=[];var string;for(var i=0,length=token.length;i<length;++i){string="";for(var j=i;j<length;++j){string+=token.charAt(j);expandedTokens.push(string)}}return expandedTokens};return AllSubstringsIndexStrategy}();var ExactWordIndexStrategy=function(){function ExactWordIndexStrategy(){}var _proto=ExactWordIndexStrategy.prototype;_proto.expandToken=function expandToken(token){return token?[token]:[]};return ExactWordIndexStrategy}();var PrefixIndexStrategy=function(){function PrefixIndexStrategy(){}var _proto=PrefixIndexStrategy.prototype;_proto.expandToken=function expandToken(token){var expandedTokens=[];var string="";for(var i=0,length=token.length;i<length;++i){string+=token.charAt(i);expandedTokens.push(string)}return expandedTokens};return PrefixIndexStrategy}();var CaseSensitiveSanitizer=function(){function CaseSensitiveSanitizer(){}var _proto=CaseSensitiveSanitizer.prototype;_proto.sanitize=function sanitize(text){return text?text.trim():""};return CaseSensitiveSanitizer}();var LowerCaseSanitizer=function(){function LowerCaseSanitizer(){}var _proto=LowerCaseSanitizer.prototype;_proto.sanitize=function sanitize(text){return text?text.toLocaleLowerCase().trim():""};return LowerCaseSanitizer}();function getNestedFieldValue(object,path){path=path||[];object=object||{};var value=object;for(var i=0;i<path.length;i++){value=value[path[i]];if(value==null){return null}}return value}var TfIdfSearchIndex=function(){function TfIdfSearchIndex(uidFieldName){this._uidFieldName=uidFieldName;this._tokenToIdfCache={};this._tokenMap={}}var _proto=TfIdfSearchIndex.prototype;_proto.indexDocument=function indexDocument(token,uid,doc){this._tokenToIdfCache={};var tokenMap=this._tokenMap;var tokenDatum;if(_typeof(tokenMap[token])!=="object"){tokenMap[token]=tokenDatum={$numDocumentOccurrences:0,$totalNumOccurrences:1,$uidMap:{}}}else{tokenDatum=tokenMap[token];tokenDatum.$totalNumOccurrences++}var uidMap=tokenDatum.$uidMap;if(_typeof(uidMap[uid])!=="object"){tokenDatum.$numDocumentOccurrences++;uidMap[uid]={$document:doc,$numTokenOccurrences:1}}else{uidMap[uid].$numTokenOccurrences++}};_proto.search=function search(tokens,corpus){var uidToDocumentMap={};for(var i=0,numTokens=tokens.length;i<numTokens;i++){var token=tokens[i];var tokenMetadata=this._tokenMap[token];if(!tokenMetadata){return[]}if(i===0){var keys=Object.keys(tokenMetadata.$uidMap);for(var j=0,numKeys=keys.length;j<numKeys;j++){var uid=keys[j];uidToDocumentMap[uid]=tokenMetadata.$uidMap[uid].$document}}else{var keys=Object.keys(uidToDocumentMap);for(var j=0,numKeys=keys.length;j<numKeys;j++){var uid=keys[j];if(_typeof(tokenMetadata.$uidMap[uid])!=="object"){delete uidToDocumentMap[uid]}}}}var documents=[];for(var uid in uidToDocumentMap){documents.push(uidToDocumentMap[uid])}var calculateTfIdf=this._createCalculateTfIdf();return documents.sort(function(documentA,documentB){return calculateTfIdf(tokens,documentB,corpus)-calculateTfIdf(tokens,documentA,corpus)})};_proto._createCalculateIdf=function _createCalculateIdf(){var tokenMap=this._tokenMap;var tokenToIdfCache=this._tokenToIdfCache;return function calculateIdf(token,documents){if(!tokenToIdfCache[token]){var numDocumentsWithToken=typeof tokenMap[token]!=="undefined"?tokenMap[token].$numDocumentOccurrences:0;tokenToIdfCache[token]=1+Math.log(documents.length/(1+numDocumentsWithToken))}return tokenToIdfCache[token]}};_proto._createCalculateTfIdf=function _createCalculateTfIdf(){var tokenMap=this._tokenMap;var uidFieldName=this._uidFieldName;var calculateIdf=this._createCalculateIdf();return function calculateTfIdf(tokens,document,documents){var score=0;for(var i=0,numTokens=tokens.length;i<numTokens;++i){var token=tokens[i];var inverseDocumentFrequency=calculateIdf(token,documents);if(inverseDocumentFrequency===Infinity){inverseDocumentFrequency=0}var uid;if(uidFieldName instanceof Array){uid=document&&getNestedFieldValue(document,uidFieldName)}else{uid=document&&document[uidFieldName]}var termFrequency=typeof tokenMap[token]!=="undefined"&&typeof tokenMap[token].$uidMap[uid]!=="undefined"?tokenMap[token].$uidMap[uid].$numTokenOccurrences:0;score+=termFrequency*inverseDocumentFrequency}return score}};return TfIdfSearchIndex}();var UnorderedSearchIndex=function(){function UnorderedSearchIndex(){this._tokenToUidToDocumentMap={}}var _proto=UnorderedSearchIndex.prototype;_proto.indexDocument=function indexDocument(token,uid,doc){if(_typeof(this._tokenToUidToDocumentMap[token])!=="object"){this._tokenToUidToDocumentMap[token]={}}this._tokenToUidToDocumentMap[token][uid]=doc};_proto.search=function search(tokens,corpus){var intersectingDocumentMap={};var tokenToUidToDocumentMap=this._tokenToUidToDocumentMap;for(var i=0,numTokens=tokens.length;i<numTokens;i++){var token=tokens[i];var documentMap=tokenToUidToDocumentMap[token];if(!documentMap){return[]}if(i===0){var keys=Object.keys(documentMap);for(var j=0,numKeys=keys.length;j<numKeys;j++){var uid=keys[j];intersectingDocumentMap[uid]=documentMap[uid]}}else{var keys=Object.keys(intersectingDocumentMap);for(var j=0,numKeys=keys.length;j<numKeys;j++){var uid=keys[j];if(_typeof(documentMap[uid])!=="object"){delete intersectingDocumentMap[uid]}}}}var keys=Object.keys(intersectingDocumentMap);var documents=[];for(var i=0,numKeys=keys.length;i<numKeys;i++){var uid=keys[i];documents.push(intersectingDocumentMap[uid])}return documents};return UnorderedSearchIndex}();var REGEX=/[^a-zа-яё0-9\-']+/i;var SimpleTokenizer=function(){function SimpleTokenizer(){}var _proto=SimpleTokenizer.prototype;_proto.tokenize=function tokenize(text){return text.split(REGEX).filter(function(text){return text})};return SimpleTokenizer}();var StemmingTokenizer=function(){function StemmingTokenizer(stemmingFunction,decoratedTokenizer){this._stemmingFunction=stemmingFunction;this._tokenizer=decoratedTokenizer}var _proto=StemmingTokenizer.prototype;_proto.tokenize=function tokenize(text){return this._tokenizer.tokenize(text).map(this._stemmingFunction)};return StemmingTokenizer}();var StopWordsMap={a:true,able:true,about:true,across:true,after:true,all:true,almost:true,also:true,am:true,among:true,an:true,and:true,any:true,are:true,as:true,at:true,be:true,because:true,been:true,but:true,by:true,can:true,cannot:true,could:true,dear:true,did:true,"do":true,does:true,either:true,"else":true,ever:true,every:true,"for":true,from:true,"get":true,got:true,had:true,has:true,have:true,he:true,her:true,hers:true,him:true,his:true,how:true,however:true,i:true,"if":true,"in":true,into:true,is:true,it:true,its:true,just:true,least:true,"let":true,like:true,likely:true,may:true,me:true,might:true,most:true,must:true,my:true,neither:true,no:true,nor:true,not:true,of:true,off:true,often:true,on:true,only:true,or:true,other:true,our:true,own:true,rather:true,said:true,say:true,says:true,she:true,should:true,since:true,so:true,some:true,than:true,that:true,the:true,their:true,them:true,then:true,there:true,these:true,they:true,"this":true,tis:true,to:true,too:true,twas:true,us:true,wants:true,was:true,we:true,were:true,what:true,when:true,where:true,which:true,"while":true,who:true,whom:true,why:true,will:true,"with":true,would:true,yet:true,you:true,your:true};StopWordsMap.constructor=false;StopWordsMap.hasOwnProperty=false;StopWordsMap.isPrototypeOf=false;StopWordsMap.propertyIsEnumerable=false;StopWordsMap.toLocaleString=false;StopWordsMap.toString=false;StopWordsMap.valueOf=false;var StopWordsTokenizer=function(){function StopWordsTokenizer(decoratedTokenizer){this._tokenizer=decoratedTokenizer}var _proto=StopWordsTokenizer.prototype;_proto.tokenize=function tokenize(text){return this._tokenizer.tokenize(text).filter(function(token){return!StopWordsMap[token]})};return StopWordsTokenizer}();function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor}var Search=function(){function Search(uidFieldName){if(!uidFieldName){throw Error("js-search requires a uid field name constructor parameter")}this._uidFieldName=uidFieldName;this._indexStrategy=new PrefixIndexStrategy;this._searchIndex=new TfIdfSearchIndex(uidFieldName);this._sanitizer=new LowerCaseSanitizer;this._tokenizer=new SimpleTokenizer;this._documents=[];this._searchableFields=[]}var _proto=Search.prototype;_proto.addDocument=function addDocument(document){this.addDocuments([document])};_proto.addDocuments=function addDocuments(documents){this._documents=this._documents.concat(documents);this.indexDocuments_(documents,this._searchableFields)};_proto.addIndex=function addIndex(field){this._searchableFields.push(field);this.indexDocuments_(this._documents,[field])};_proto.search=function search(query){var tokens=this._tokenizer.tokenize(this._sanitizer.sanitize(query));return this._searchIndex.search(tokens,this._documents)};_proto.indexDocuments_=function indexDocuments_(documents,_searchableFields){this._initialized=true;var indexStrategy=this._indexStrategy;var sanitizer=this._sanitizer;var searchIndex=this._searchIndex;var tokenizer=this._tokenizer;var uidFieldName=this._uidFieldName;for(var di=0,numDocuments=documents.length;di<numDocuments;di++){var doc=documents[di];var uid;if(uidFieldName instanceof Array){uid=getNestedFieldValue(doc,uidFieldName)}else{uid=doc[uidFieldName]}for(var sfi=0,numSearchableFields=_searchableFields.length;sfi<numSearchableFields;sfi++){var fieldValue;var searchableField=_searchableFields[sfi];if(searchableField instanceof Array){fieldValue=getNestedFieldValue(doc,searchableField)}else{fieldValue=doc[searchableField]}if(fieldValue!=null&&typeof fieldValue!=="string"&&fieldValue.toString){fieldValue=fieldValue.toString()}if(typeof fieldValue==="string"){var fieldTokens=tokenizer.tokenize(sanitizer.sanitize(fieldValue));for(var fti=0,numFieldValues=fieldTokens.length;fti<numFieldValues;fti++){var fieldToken=fieldTokens[fti];var expandedTokens=indexStrategy.expandToken(fieldToken);for(var eti=0,nummExpandedTokens=expandedTokens.length;eti<nummExpandedTokens;eti++){var expandedToken=expandedTokens[eti];searchIndex.indexDocument(expandedToken,uid,doc)}}}}}};_createClass(Search,[{key:"indexStrategy",set:function set(value){if(this._initialized){throw Error("IIndexStrategy cannot be set after initialization")}this._indexStrategy=value},get:function get(){return this._indexStrategy}},{key:"sanitizer",set:function set(value){if(this._initialized){throw Error("ISanitizer cannot be set after initialization")}this._sanitizer=value},get:function get(){return this._sanitizer}},{key:"searchIndex",set:function set(value){if(this._initialized){throw Error("ISearchIndex cannot be set after initialization")}this._searchIndex=value},get:function get(){return this._searchIndex}},{key:"tokenizer",set:function set(value){if(this._initialized){throw Error("ITokenizer cannot be set after initialization")}this._tokenizer=value},get:function get(){return this._tokenizer}}]);return Search}();var TokenHighlighter=function(){function TokenHighlighter(opt_indexStrategy,opt_sanitizer,opt_wrapperTagName){this._indexStrategy=opt_indexStrategy||new PrefixIndexStrategy;this._sanitizer=opt_sanitizer||new LowerCaseSanitizer;this._wrapperTagName=opt_wrapperTagName||"mark"}var _proto=TokenHighlighter.prototype;_proto.highlight=function highlight(text,tokens){var tagsLength=this._wrapText("").length;var tokenDictionary=Object.create(null);for(var i=0,numTokens=tokens.length;i<numTokens;i++){var token=this._sanitizer.sanitize(tokens[i]);var expandedTokens=this._indexStrategy.expandToken(token);for(var j=0,numExpandedTokens=expandedTokens.length;j<numExpandedTokens;j++){var expandedToken=expandedTokens[j];if(!tokenDictionary[expandedToken]){tokenDictionary[expandedToken]=[token]}else{tokenDictionary[expandedToken].push(token)}}}var actualCurrentWord="";var sanitizedCurrentWord="";var currentWordStartIndex=0;for(var i=0,textLength=text.length;i<textLength;i++){var character=text.charAt(i);if(character===" "){actualCurrentWord="";sanitizedCurrentWord="";currentWordStartIndex=i+1}else{actualCurrentWord+=character;sanitizedCurrentWord+=this._sanitizer.sanitize(character)}if(tokenDictionary[sanitizedCurrentWord]&&tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord)>=0){actualCurrentWord=this._wrapText(actualCurrentWord);text=text.substring(0,currentWordStartIndex)+actualCurrentWord+text.substring(i+1);i+=tagsLength;textLength+=tagsLength}}return text};_proto._wrapText=function _wrapText(text){var tagName=this._wrapperTagName;return"<"+tagName+">"+text+"</"+tagName+">"};return TokenHighlighter}();exports.AllSubstringsIndexStrategy=AllSubstringsIndexStrategy;exports.CaseSensitiveSanitizer=CaseSensitiveSanitizer;exports.ExactWordIndexStrategy=ExactWordIndexStrategy;exports.LowerCaseSanitizer=LowerCaseSanitizer;exports.PrefixIndexStrategy=PrefixIndexStrategy;exports.Search=Search;exports.SimpleTokenizer=SimpleTokenizer;exports.StemmingTokenizer=StemmingTokenizer;exports.StopWordsMap=StopWordsMap;exports.StopWordsTokenizer=StopWordsTokenizer;exports.TfIdfSearchIndex=TfIdfSearchIndex;exports.TokenHighlighter=TokenHighlighter;exports.UnorderedSearchIndex=UnorderedSearchIndex;Object.defineProperty(exports,"__esModule",{value:true})});
