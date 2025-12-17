import { DataBase } from "../../../app/server_app/data/DataBase"
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

type SomeWithId = {
    id: string,
    name: string,
    color: string,
}
describe('DataBase test suit', ()=>{
    let sut: DataBase<SomeWithId>;
    const fakeId = '1234';
    const someObject1 = { id: '', name: 'May', color: 'blue'};
    const someObject2 = { id: '', name: 'Two', color: 'yellow'};
    const someObject3 = { id: '', name: 'Three', color: 'white'};
    const someObject4 = { id: '', name: 'Four', color: 'blue'};

    beforeEach(()=>{
        sut = new DataBase<SomeWithId>();
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(fakeId);
    });

    it('should return ID after insert', async ()=>{
        const actual = await sut.insert({id: '1234'} as any)
        expect(actual).toBe(fakeId);
    });
 
    it('should get element after insert', async ()=>{
        const id = await sut.insert(someObject1);
        const actual = await sut.getBy('id', id);
        expect(actual).toBe(someObject1);
    });

    it('should get all elements with same property', async ()=>{
        await sut.insert(someObject1);
        await sut.insert(someObject2);
        await sut.insert(someObject3);
        await sut.insert(someObject4);
        const expected = [someObject1,someObject4];
        const actual = await sut.findAllBy('color', 'blue');      
        expect(actual).toStrictEqual(expected);
    });
    
    it('should change color on object', async ()=>{
        const id = await sut.insert(someObject1);
        const expectedColor = 'red';

        await sut.update(id, 'color', expectedColor);
        const object = await sut.getBy('id',id);
        const actualColor = object.color;

        expect(actualColor).toBe(expectedColor);
    });

    it('should delete element from object', async ()=>{
        const id = await sut.insert(someObject1);
        await sut.delete(id);

        const actual = await sut.getBy('id',id);

        expect(actual).toBeUndefined();
    });

    it('should return all elements', async()=>{
        await sut.insert(someObject1);
        await sut.insert(someObject2);
        await sut.insert(someObject3);
        await sut.insert(someObject4);
        const expected = [someObject1, someObject2, someObject3, someObject4];

        const actual = await sut.getAllElements();
        expect(actual).toStrictEqual(expected);
    });
})