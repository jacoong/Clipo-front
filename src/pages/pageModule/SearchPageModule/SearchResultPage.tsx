import React, {ReactNode,useEffect} from 'react';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import { useParams,useSearchParams } from 'react-router-dom';
import useNavInfo from '../../../customHook/useNavInfo';

const VALID_FILTERS = ['hashtag','account'] as const
type FilterType = (typeof VALID_FILTERS)[number];

const SearchResultPage =()=>{

    const {typeOfFilter} = useParams();
    const [searchParams] = useSearchParams();

    const { updateNavInfo } = useNavInfo();

    function capitalizeFirstLetter(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
      }
      

    const value = searchParams.get('value');

    useEffect(()=>{
        if(value){
            updateNavInfo({type:'searchResult',titleValue:value,value:{isBack:true}})
        }
    },[])

    
    const isValidFilter = (typeOfFilter: string): typeOfFilter is FilterType =>
        VALID_FILTERS.includes(typeOfFilter as FilterType);

    
    if (!typeOfFilter || !isValidFilter(typeOfFilter)) {
    return <div>잘못된 경로입니다.</div>;
    }
    return(
        <PageNationStandard typeOfFilter={capitalizeFirstLetter(typeOfFilter) as 'Hashtag' | 'Account'} value={value}></PageNationStandard>
    )
}

export default SearchResultPage;