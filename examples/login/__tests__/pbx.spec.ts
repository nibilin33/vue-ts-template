import { PbxAPI } from '../entity/pbx';
import { transformToUse } from '../adapters/pbx';

test('测试构建函数对数据的限制', ()=> {
    const pbxWrong = new PbxAPI(Object.create({id:''})).params;
    expect(pbxWrong).toEqual({username:'',code:''});
    const pbxRight = new PbxAPI().params;
    expect(pbxRight).toEqual({username:'',code:''});
})
test('测试接口转换的结果', ()=> {
    const data =  transformToUse({id:'xxx'});
    expect(data).toEqual({username:'',code:''});
})